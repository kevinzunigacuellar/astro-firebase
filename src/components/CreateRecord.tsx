import { createResource, createSignal, Show, Suspense } from "solid-js";
import { createBirthdaySchema } from "../lib/schemas";
import ErrorPlaceholder from "./ErrorPlaceholder";
import Error from "./Error";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<
  z.inferFormattedError<typeof createBirthdaySchema>
>;

async function postFormData(formData: FormData) {
  const res = await fetch("/api/birthdays", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    return data;
  }

  if (res.redirected) {
    window.location.assign(res.url);
  }
}

export default function CreateRecord() {
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);
  const [clientErrors, setClientErrors] = createSignal<Errors>();

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setClientErrors();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    const result = createBirthdaySchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.flatten() as Errors;
      setClientErrors(errors);
      return;
    }
    setFormData(data);
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
          placeholder="Samantha"
          name="name"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show
          when={clientErrors()?.fieldErrors.name}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.name} />
        </Show>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label for="affiliation" class="font-medium text-zinc-300 text-sm">
          Affiliation
        </label>
        <input
          type="text"
          placeholder="School"
          id="affiliation"
          name="affiliation"
          class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
        />
        <Show
          when={clientErrors()?.fieldErrors.affiliation}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.affiliation} />
        </Show>
      </div>
      <div class="flex flex-row gap-4 w-full">
        <div class="grid grid-cols-1 gap-2 flex-1">
          <label for="day" class="font-medium text-zinc-300 text-sm">
            Day
          </label>
          <input
            type="number"
            id="day"
            name="day"
            class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
          />
          <Show
            when={clientErrors()?.fieldErrors.day}
            fallback={<ErrorPlaceholder />}
          >
            <Error message={clientErrors()?.fieldErrors.day} />
          </Show>
        </div>
        <div class="grid grid-cols-1 gap-2 flex-1">
          <label for="month" class="font-medium text-zinc-300 text-sm">
            Month
          </label>
          <input
            type="number"
            id="month"
            name="month"
            class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
          />
          <Show
            when={clientErrors()?.fieldErrors.month}
            fallback={<ErrorPlaceholder />}
          >
            <Error message={clientErrors()?.fieldErrors.month} />
          </Show>
        </div>
        <div class="grid grid-cols-1 gap-2 flex-1">
          <label for="year" class="font-medium text-zinc-300 text-sm">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            min={1900}
            max={new Date().getFullYear()}
            class="rounded-md py-1 px-3 bg-zinc-800 text-zinc-300 border border-zinc-700 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:bg-zinc-900 focus:ring-opacity-60"
          />
          <Show
            when={clientErrors()?.fieldErrors.year}
            fallback={<ErrorPlaceholder />}
          >
            <Error message={clientErrors()?.fieldErrors.year} />
          </Show>
        </div>
      </div>
      <button
        class="bg-zinc-100 py-1.5 border border-zinc-100 rounded-md mt-2 text-black font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 focus:ring-offset-zinc-900"
        type="submit"
        disabled={response.loading}
      >
        <Show fallback="Create" when={response.loading}>
          Creating...
        </Show>
      </button>
    </form>
  );
}
