import { For, Show, batch, createSignal } from "solid-js";
import type { BirthdayType } from "../lib/types";
import { format } from "date-fns";

interface BirthdayCardProps extends BirthdayType {
  difference: number;
}

const today = new Date();
const currentYear = today.getFullYear();

export default function BirthdayList({
  birthdays,
}: {
  birthdays: BirthdayCardProps[];
}) {
  const filters = ["all", ...new Set(birthdays.map(item => item.affiliation))]
  const [birthdayCards, setBirthdayCards] = createSignal(birthdays);
  const [currentfilter, setCurrentFilter] = createSignal("all");

  function filterHandler(filter: string) {
    if (filter === "all") {
      batch(() => {
        setCurrentFilter("all");
        setBirthdayCards(birthdays);
      })
    } else {
      batch(() => {
      setCurrentFilter(filter);
      setBirthdayCards(birthdays.filter(birthday => birthday.affiliation === filter));
      })
    }
  }

  return (
    <>
      <div class="flex gap-3">
        <For each={filters}>
          {(filter) => (<button class="px-4 py-1 rounded-md capitalize" classList={
            { "bg-zinc-100": filter === currentfilter(),
              "bg-zinc-700 text-zinc-300": filter !== currentfilter() }
          } onClick={() => filterHandler(filter)}>{filter}</button>)}
        </For>
      </div>
      <For each={birthdayCards()}>
        {(birthday) => <BirthdayCard birthday={birthday} />}
      </For>
    </>
  );
}

function BirthdayCard({ birthday }: { birthday: BirthdayCardProps }) {
  return (
    <li class="bg-zinc-800 rounded-md border border-zinc-700 p-4 flex justify-between items-center">
      <div>
        <p class="font-medium flex items-center gap-2">
          <a href={`/edit/${birthday.documentId}`} class="text-white text-lg">{birthday.name}</a>
          <span class="bg-teal-800 text-teal-100 text-xs px-2 py-0.5 rounded uppercase inline-block">
            {birthday.affiliation}
          </span>
        </p>
        <p class="text-zinc-400">
          <Show
            when={birthday.difference === 0 && birthday.date.year !== 0}
            fallback={format(
              new Date(
                `${currentYear}-${birthday.date.month}-${birthday.date.day}`
              ),
              "MMMM d"
            )}
          >
            {`Turns ${currentYear - birthday.date.year}!`}
          </Show>
        </p>
      </div>

      <Show
        when={birthday.difference === 0}
        fallback={<DayCounter days={birthday.difference} />}
      >
        <div class="flex flex-col items-center justify-center bg-yellow-800 py-1 px-2 rounded text-zinc-400 h-14 w-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            class="h-10 w-auto text-yellow-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
            />
          </svg>
        </div>
      </Show>
    </li>
  );
}

function DayCounter({ days }: { days: number }) {
  return (
    <div class="flex flex-col items-center justify-center bg-zinc-700 py-1 px-2 rounded font-medium text-zinc-400 h-14 w-14 font-sans text-sm">
      <span>{days}</span>
      <span>
        <Show when={days > 1} fallback={"day"}>
          days
        </Show>
      </span>
    </div>
  );
}
