import { createSignal, Show } from "solid-js";
import { userAndPasswordSchema } from "../lib/schemas";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase/client";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<
  z.inferFormattedError<typeof userAndPasswordSchema>
>;

export default function LoginForm() {
  const [serverError, setServerError] = createSignal<string>();
  const [errors, setErrors] = createSignal<Errors>();

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setErrors();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const result = userAndPasswordSchema.safeParse(data);

    // if there are errors, set them and return
    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setErrors(errors);
      return;
    }
    const { email, password } = result.data;
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      switch (error.code) {
        case "auth/user-not-found":
          setServerError("No user found with that email");
          break;
        case "auth/wrong-password":
          setServerError("Incorrect password");
          break;
        default:
          setServerError("Something went wrong, please try again later");
          break;
      }
      return;
    }

    const idToken = await userCredential.user.getIdToken();
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      setServerError("Something went wrong, please try again later");
    }

    if (response.redirected) {
      window.location.assign(response.url);
    }
  }

  return (
    <form class="grid grid-cols-1 gap-3 w-full" onSubmit={submit}>
      <div class="grid grid-cols-1 gap-2">
        <label for="email" class="font-medium text-zinc-300 text-sm">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show
          when={errors()?.fieldErrors.email}
          fallback={
            <p class="-mt-1 text-sm text-red-500 invisible">
              Your email just boom
            </p>
          }
        >
          <p class="-mt-1 text-sm text-red-500">
            {errors()?.fieldErrors.email}
          </p>
        </Show>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label for="password" class="font-medium text-zinc-300 text-sm">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show
          when={errors()?.fieldErrors.password}
          fallback={
            <p class="-mt-1 text-sm text-red-500 invisible">
              Your password just boom
            </p>
          }
        >
          <p class="-mt-1 text-sm text-red-500">
            {errors()?.fieldErrors.password}
          </p>
        </Show>
      </div>
      <button
        class="bg-zinc-100 py-1.5 border border-zinc-100 rounded-md mt-2 text-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 focus:ring-offset-zinc-900"
        type="submit"
      >
        Sign in
      </button>
      <Show when={serverError()}>
        <p class="text-red-500 text-sm">{serverError()}</p>
      </Show>
    </form>
  );
}
