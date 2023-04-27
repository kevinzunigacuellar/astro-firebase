import { createResource, createSignal, Show } from "solid-js";
import { createBirthdaySchema } from "@lib/schemas";
import ErrorPlaceholder from "@components/ErrorPlaceholder";
import Error from "@components/Error";
import type { BirthdayTypeWithId } from "@lib/types";
import type { z } from "zod";

type Errors = z.typeToFlattenedError<
  z.inferFormattedError<typeof createBirthdaySchema>
>;

export default function BirthdayForm({
  birthdayInfo,
  type,
}: {
  birthdayInfo?: BirthdayTypeWithId;
  type?: "edit";
}) {
  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, submitFormData);
  const [clientErrors, setClientErrors] = createSignal<Errors>();

  async function submitFormData(formData: FormData) {
    let apiUrl = "/api/birthdays";
    let method = "POST";
    if (type === "edit" && birthdayInfo?.authorId) {
      formData.append("authorId", birthdayInfo.authorId);
      apiUrl = `/api/birthdays/${birthdayInfo?.documentId}`;
      method = "PUT";
    }

    const res = await fetch(apiUrl, {
      method,
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

  async function deleteRecord(documentId?: string) {
    if (!documentId) return;
    const res = await fetch(`/api/birthdays/${documentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.redirected) {
      window.location.assign(res.url);
    }
  }

  return (
    <form class="grid grid-cols-1 gap-3 w-full" onSubmit={submit}>
      <div class="grid grid-cols-1 gap-2">
        <label for="name" 
        class="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={birthdayInfo?.name ?? ""}
          name="name"
          class="rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
        />
        <Show
          when={clientErrors()?.fieldErrors.name}
          fallback={<ErrorPlaceholder />}
        >
          <Error message={clientErrors()?.fieldErrors.name} />
        </Show>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label for="affiliation" class="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
          Affiliation
        </label>
        <input
          type="text"
          id="affiliation"
          value={birthdayInfo?.affiliation ?? ""}
          name="affiliation"
          class="rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
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
          <label for="day" class="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
            Day
          </label>
          <input
            type="number"
            id="day"
            name="day"
            value={birthdayInfo?.date.day ?? ""}
            class="rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
          />
          <Show
            when={clientErrors()?.fieldErrors.day}
            fallback={<ErrorPlaceholder />}
          >
            <Error message={clientErrors()?.fieldErrors.day} />
          </Show>
        </div>
        <div class="grid grid-cols-1 gap-2 flex-1">
          <label for="month" class="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
            Month
          </label>
          <input
            type="number"
            id="month"
            name="month"
            value={birthdayInfo?.date.month ?? ""}
            class="rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
          />
          <Show
            when={clientErrors()?.fieldErrors.month}
            fallback={<ErrorPlaceholder />}
          >
            <Error message={clientErrors()?.fieldErrors.month} />
          </Show>
        </div>
        <div class="grid grid-cols-1 gap-2 flex-1">
          <label for="year" class="font-medium dark:text-zinc-300 text-zinc-900 text-sm">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            min={1900}
            value={birthdayInfo?.date.year ?? ""}
            max={new Date().getFullYear()}
            class="rounded-md py-1 px-3 dark:bg-zinc-800 dark:text-zinc-300 border bg-zinc-50 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:bg-zinc-900 focus:bg-white focus:ring-opacity-60"
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
        class="dark:bg-zinc-100 bg-zinc-900 border-zinc-900 py-1.5 border dark:border-zinc-100 rounded-md mt-1 dark:text-zinc-900 text-zinc-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={response.loading}
      >
        <Show
          fallback={type === "edit" ? "Edit" : "Create"}
          when={response.loading}
        >
          {type === "edit" ? "Editing..." : "Creating..."}
        </Show>
      </button>
      <Show when={type === "edit"}>
        <button
          class="dark:bg-red-600 bg-red-400 hover:bg-red-500 border-transparent py-1.5 border rounded-md mt-1 dark:text-white text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          disabled={response.loading}
          onClick={() => deleteRecord(birthdayInfo?.documentId)}
        >
          Delete Record
        </button>
      </Show>
    </form>
  );
}
