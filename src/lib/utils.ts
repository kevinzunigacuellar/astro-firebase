import { auth } from "@lib/firebase/server";
import { differenceInCalendarDays } from "date-fns";
import type { BirthdayTypeWithId } from "@lib/types";

export async function getUser(cookie: string) {
  try {
    const decodedIdToken = await auth.verifySessionCookie(cookie, true);
    const user = await auth.getUser(decodedIdToken.uid);
    return user;
  } catch (error) {
    return null;
  }
}

export function getDifferenceInDays(birthdays: BirthdayTypeWithId[]) {
  const birthdaysWithDifference = birthdays.map((birthday) => {
    const today = new Date();
    const date = new Date(
      `${today.getFullYear()}-${birthday.date.month}-${birthday.date.day}`
    );
    const difference = differenceInCalendarDays(date, today);
    const differenceInDays = difference < 0 ? 365 + difference : difference;
    return { ...birthday, difference: differenceInDays };
  });
  return birthdaysWithDifference;
}
