export type FormattedSubscription = {
  id: number;
  startDate: Date;
  endDate: Date;
  competitions: string[];
  competitionGroups: string[];
};

export type CachedFormattedSubscription = {
  id: number;
  startDate: string;
  endDate: string;
  competitions: string[];
  competitionGroups: string[];
};
