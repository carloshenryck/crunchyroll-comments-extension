export type ISeasons = Record<string, ISeason[] | ISeason>;

export interface ISeason {
  firstEp: number;
  lastEp: number;
  betterAnimeName: string;
}
