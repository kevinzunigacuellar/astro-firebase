import { For } from "solid-js";
import { Filters } from "./Filters";
import { BirthdayCard } from "./BirthdayCard";
import type { BirthdayWithDifference } from "@lib/types";
import { useFilters } from "@hooks/useFilter";

export default function BirthdayList({birthdays} : {birthdays: BirthdayWithDifference[]}) {
  const { birthdayCards, filters, filterBy, currentfilter } = useFilters(birthdays);
  
  return (
    <>
      <Filters filters={filters} filterBy={filterBy} currentfilter={currentfilter} />
      <For each={birthdayCards()}>
        {(birthday) => <BirthdayCard birthday={birthday} />}
      </For>
    </>
  );
}


