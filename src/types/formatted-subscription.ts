export type FormattedSubscription = {
  id: string;
  startDate: Date;
  endDate: Date;
  competitions: string[];
  competitionGroups: string[];
};

export type CachedFormattedSubscription = {
  id: string;
  startDate: string;
  endDate: string;
  competitions: string[];
  competitionGroups: string[];
};
