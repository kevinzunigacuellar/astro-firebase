import { createSignal, Show } from "solid-js";
import { registerSchema } from "../lib/schemas";
import ErrorPlaceholder from "./ErrorPlaceholder";
import Error from "./Error";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<
  z.inferFormattedError<typeof registerSchema>
>;

export default function SignupForm() {
  const [serverError, setServerError] = createSignal<string>();
  const [errors, setErrors] = createSignal<Errors>();

  async function submit(e: SubmitEvent) {
    e.preventDefault();

    // clear errors
    setErrors(undefined);
    setServerError(undefined);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = registerSchema.safeParse(formData);

    // client-side validation
    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setErrors(errors);
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const { errors } = await response.json();
      setServerError(errors);
    }

    if (response.redirected) {
      window.location.assign(response.url);
    }
  }

  return (
    <form class="grid grid-cols-1 gap-3 w-full" onSubmit={submit}>
      <div class="grid grid-cols-1 gap-2">
        <label for="name" class="font-medium text-zinc-300 text-sm">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show when={errors()?.fieldErrors.name} fallback={<ErrorPlaceholder />}>
          <p class="-mt-1 text-sm text-red-500">{errors()?.fieldErrors.name}</p>
        </Show>
      </div>
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
          fallback={<ErrorPlaceholder />}
        >
          <Error message={errors()?.fieldErrors.email} />
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
          fallback={<ErrorPlaceholder />}
        >
          <Error message={errors()?.fieldErrors.password} />
        </Show>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label for="confirmPassword" class="font-medium text-zinc-300 text-sm">
          Confirm password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show
          when={errors()?.fieldErrors.confirmPassword}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={errors()?.fieldErrors.confirmPassword} />
        </Show>
      </div>
      <button
        class="bg-zinc-100 py-1.5 border border-zinc-100 rounded-md mt-2 text-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 focus:ring-offset-zinc-900"
        type="submit"
      >
        Sign up
      </button>
      <Show when={serverError()}>
        <Error message={serverError()} />
      </Show>
    </form>
  );
}
