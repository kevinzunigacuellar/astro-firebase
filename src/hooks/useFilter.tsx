import { batch, createSignal } from "solid-js";
import type { BirthdayWithDifference } from "@lib/types";

export function useFilters(birthdays: BirthdayWithDifference[]) {
  const [birthdayCards, setBirthdayCards] = createSignal(birthdays);
  const [currentfilter, setCurrentFilter] = createSignal("all");

  function filterBy(filter: string) {
    if (filter === "all") {
      batch(() => {
        setCurrentFilter("all");
        setBirthdayCards(birthdays);
      });
    } else {
      batch(() => {
        setCurrentFilter(filter);
        setBirthdayCards(
          birthdays.filter((birthday) => birthday.affiliation === filter)
        );
      });
    }
  }

  const filters = [
    "all",
    ...new Set(birthdays.map((item) => item.affiliation).filter(Boolean)),
  ];

  return {
    birthdayCards,
    currentfilter,
    filterBy,
    filters,
  };
}
