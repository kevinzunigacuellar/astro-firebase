import {
  createSignal,
  Show,
  createResource,
  Suspense,
  Switch,
  Match,
} from "solid-js";
import { loginSchema } from "../lib/schemas";
import { signInWithEmailAndPassword, inMemoryPersistence, getAuth } from "firebase/auth";
import { app } from "../lib/firebase/client";
import ErrorPlaceholder from "./ErrorPlaceholder";
import Error from "./Error";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<z.inferFormattedError<typeof loginSchema>>;
type SucessForm = z.infer<typeof loginSchema>;

async function postFormData(formData: SucessForm) {
  const { email, password } = formData;
  const auth = getAuth(app)
  
  /* This will set the persistence to browser session */
  const userCredential = await auth.setPersistence(inMemoryPersistence).then(() => signInWithEmailAndPassword(
    auth,
    email,
    password
  ))
  const idToken = await userCredential.user.getIdToken();
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const data = await res.json();
    return data;
  }

  if (res.redirected) {
    window.location.assign(res.url);
  }
}

export default function LoginForm() {
  const [formData, setFormData] = createSignal<SucessForm>();
  const [response] = createResource(formData, postFormData);
  const [clientErrors, setClientErrors] = createSignal<Errors>();

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setClientErrors();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setClientErrors(errors);
      return;
    }
    setFormData(result.data);
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
          when={clientErrors()?.fieldErrors.email}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.email} />
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
          when={clientErrors()?.fieldErrors.password}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.password} />
        </Show>
      </div>
      <button
        class="bg-zinc-100 py-1.5 border border-zinc-100 rounded-md mt-2 text-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={response.loading}
      >
        <Show fallback="Sign in" when={response.loading}>
          Signing in...
        </Show>
      </button>
      <Suspense>
        <Switch>
          <Match when={response.error?.code === "auth/wrong-password"}>
            <Error message="Your password is incorrect" />
          </Match>
          <Match when={response.error?.code === "auth/user-not-found"}>
            <Error message="You don't have an account with this email" />
          </Match>
          {/* Fallback error */}
          <Match when={response()?.error}>
            <Error message={response().error} />
          </Match>
        </Switch>
      </Suspense>
    </form>
  );
}
