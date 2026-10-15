/** How the front weight of every key is chosen. */
export enum FrontWeightDesignMode {
  Computed = 'computed',
  StandardCurves = 'standard-curves',
  AsMeasured = 'as-measured',
}

export type FrontWeightDesignTarget = number | null;
