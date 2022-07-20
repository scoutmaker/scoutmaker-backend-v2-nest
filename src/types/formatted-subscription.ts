export type FormattedSubscription = {
  id: number;
  startDate: Date;
  endDate: Date;
  competitions: number[];
  competitionGroups: number[];
};

export type CachedFormattedSubscription = {
  id: number;
  startDate: string;
  endDate: string;
  competitions: number[];
  competitionGroups: number[];
};
