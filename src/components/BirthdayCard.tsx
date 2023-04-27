import type { BirthdayWithDifference } from "@lib/types";
import { Show } from "solid-js";
import { format } from "date-fns";

interface BirthdayCardProps {
  birthday: BirthdayWithDifference;
}

const today = new Date();
const currentYear = today.getFullYear();
const colorFilterMapping = new Map<string, string>();
const colorPallete = [
  "dark:bg-blue-800 dark:text-blue-200 bg-blue-200 text-blue-800",
  "dark:bg-green-800 dark:text-green-200 bg-green-200 text-green-800",
  "dark:bg-yellow-800 dark:text-yellow-200 bg-yellow-200 text-yellow-800",
  "dark:bg-indigo-800 dark:text-indigo-200 bg-indigo-200 text-indigo-800",
  "dark:bg-purple-800 dark:text-purple-200 bg-purple-200 text-purple-800",
];

export function BirthdayCard(props: BirthdayCardProps) {
  return (
    <li class="dark:bg-zinc-800 bg-white rounded-md shadow-sm p-4 flex justify-between items-center">
      <div>
        <p class="font-medium flex items-center gap-2">
          <a
            href={`/edit/${props.birthday.documentId}`}
            class="dark:text-white text-zinc-800 text-lg"
          >
            {props.birthday.name}
          </a>
          <Show when={props.birthday.affiliation} fallback={null}>
            <Tag affiliation={props.birthday.affiliation as string} />
          </Show>
        </p>
        <p class="dark:text-zinc-400 text-zinc-500">
          <Show
            when={
              props.birthday.difference === 0 && props.birthday.date.year !== 0
            }
            fallback={format(
              new Date(
                `${currentYear}-${props.birthday.date.month}-${props.birthday.date.day}`
              ),
              "MMMM d"
            )}
          >
            {`Turns ${currentYear - props.birthday.date.year}!`}
          </Show>
        </p>
      </div>

      <Show
        when={props.birthday.difference === 0}
        fallback={<DayCounter days={props.birthday.difference} />}
      >
        <CakeIcon />
      </Show>
    </li>
  );
}

function DayCounter({ days }: { days: number }) {
  return (
    <div class="flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-700 py-1 px-2 rounded font-medium dark:text-zinc-400 text-zinc-600 h-14 w-14 font-sans text-sm">
      <span>{days}</span>
      <span>
        <Show when={days > 1} fallback={"day"}>
          days
        </Show>
      </span>
    </div>
  );
}

function CakeIcon() {
  return (
    <div class="flex flex-col items-center justify-center dark:bg-yellow-800 bg-yellow-200 py-1 px-2 rounded text-zinc-400 h-14 w-14">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width={1.5}
        stroke="currentColor"
        class="h-10 w-auto dark:text-yellow-400 text-yellow-700"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
        />
      </svg>
    </div>
  );
}

function Tag({ affiliation }: { affiliation: string }) {
  if (!colorFilterMapping.has(affiliation)) {
    colorFilterMapping.set(
      affiliation,
      colorPallete[colorFilterMapping.size % colorPallete.length]
    );
  }
  return (
    <span
      class={`text-xs px-2 py-0.5 font-semibold rounded uppercase inline-block ${colorFilterMapping.get(
        affiliation
      )}`}
    >
      {affiliation}
    </span>
  );
}
