import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { differenceInCalendarDays, format } from "date-fns";
import type { BirthdayType } from "../lib/types";

interface BirthdayCardProps extends BirthdayType {
  difference: number;
}

const today = new Date();
const currentYear = today.getFullYear();

export default function BirthdayList({
  birthdays,
}: {
  birthdays: BirthdayType[];
}) {
  /* inject the days difference into the birthday object */
  const allBirthdays = birthdays.map((birthday) => {
    const date = new Date(
      `${currentYear}-${birthday.date.month}-${birthday.date.day}`
    );
    const difference = differenceInCalendarDays(date, today);
    return { ...birthday, difference };
  });

  const [birthdayCards, setBirthdayCards] = createStore(allBirthdays);

  return (
    <div class="w-full flex flex-col items-center">
      <div class="flex gap-4 mb-6"></div>
      <ul class="w-full grid grid-cols-1 gap-6 max-w-xl">
        <For each={birthdayCards}>
          {(birthday) => <BirthdayCard birthday={birthday} />}
        </For>
      </ul>
    </div>
  );
}

function BirthdayCard({ birthday }: { birthday: BirthdayCardProps }) {
  return (
    <li class="bg-zinc-800 rounded-md border border-zinc-700 p-4 flex justify-between items-center">
      <div class="">
        <p class="font-medium flex items-center gap-2">
          <span class="text-white text-lg">{birthday.name}</span>
          <span class="bg-pink-700 text-pink-100 text-xs px-2 py-0.5 rounded-full uppercase inline-block tracking-tight">
            {birthday.affiliation}
          </span>
        </p>
        <p class="text-zinc-400">
          {format(
            new Date(
              `${currentYear}-${birthday.date.month}-${birthday.date.day}`
            ),
            "MMMM d"
          )}
        </p>
      </div>
      <div class="flex flex-col items-center bg-zinc-700 py-1 px-2 rounded text-zinc-400">
        <div>{birthday.difference}</div>
        <div>days</div>
      </div>
    </li>
  );
}
