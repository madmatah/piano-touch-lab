/** How the wippen support springs are designed, if at all. */
export enum WippenSupportSpringsDesignMode {
  None = 'none',
  AsMeasured = 'as-measured',
  Constant = 'constant',
  SmoothTransition = 'smooth-transition',
}

export interface WippenTensionDesign {
  numberOfSprings: number;
  springBalanceWeight: number;
  tensionDropIndex?: number;
}

export type WippenSupportSpringsDesignTarget =
  | null
  | number
  | WippenTensionDesign;
