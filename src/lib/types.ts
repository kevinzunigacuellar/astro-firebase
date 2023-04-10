export interface BirthdayType {
  name: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
  affiliation: string;
  authorId: string;
}

export interface BirthdayTypeWithId extends BirthdayType {
  documentId: string;
}
