import { Suspense, createSignal, createResource, Show } from "solid-js";
import { userAndPasswordSchema } from "../lib/schemas";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<
  z.inferFormattedError<typeof userAndPasswordSchema>
>;

async function postFormData(formData: FormData) {
  const response = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  const data = await response.json();
  return data;
}

export default function SignupForm() {
  const [formData, setFormData] = createSignal<FormData>();
  const [errors, setErrors] = createSignal<Errors>();
  const [response] = createResource(formData, postFormData);

  function submit(e: SubmitEvent) {
    e.preventDefault();
    setErrors(undefined);
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const result = userAndPasswordSchema.safeParse(data);

    // client-side validation
    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setErrors(errors);
      return;
    }
    setFormData(data);
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
              This is an email error
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
              This is a password error
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
        Sign up
      </button>
      {/* We will use this suspense to return server errors:
          - email already exists
        */}
      <Suspense>{<p class="text-white">{response()?.error}</p>}</Suspense>
    </form>
  );
}
