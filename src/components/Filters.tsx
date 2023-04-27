import { For, Show } from "solid-js";

interface FiltersProps {
  filters: (string | undefined)[];
  currentfilter: () => string;
  filterBy: (filter: string) => void;
}

export function Filters(props: FiltersProps) {
  return (
    <Show when={props.filters?.length !== 0} fallback={null}>
      <div class="flex gap-3 overflow-x-auto sm:overflow-x-visible">
        <For each={props.filters}>
          {(filter) => (
            <button
              class="px-4 py-1 rounded-md uppercase font-medium text-sm tracking-wide border"
              classList={{
                "dark:bg-purple-800 dark:border-purple-600 dark:text-purple-200 bg-purple-300 border-purple-500 text-purple-900":
                  filter === props.currentfilter(),
                "dark:bg-zinc-700 dark:border-zinc-600 bg-white dark:text-zinc-200 text-zinc-600 hover:border-purple-400 hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-900 dark:hover:border-purple-700 dark:hover:text-purple-300":
                  filter !== props.currentfilter(),
              }}
              onClick={() => props.filterBy(filter ?? "all")}
            >
              {filter}
            </button>
          )}
        </For>
      </div>
    </Show>
  );
}
