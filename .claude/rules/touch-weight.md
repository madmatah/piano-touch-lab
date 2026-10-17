---
paths:
  - 'src/lib/piano/**'
  - 'src/hooks/keyboard/**'
  - 'src/hooks/standard-curves/**'
  - 'src/hooks/series/**'
  - 'src/contexts/keyboard-analysis-context.tsx'
  - 'src/components/analyze/**'
  - 'src/components/design/**'
  - 'src/components/charts/**'
  - 'src/components/home/**'
  - 'src/components/pages/HelpPage.tsx'
---

# Touch weight metrology

The domain follows David C. Stanwood's touch weight metrology. Every weight is in grams, and a ratio has no unit. The down, up, front, balance and friction weights are forces at the front of the key; the strike weight is weighed at the hammer's strike line and the wippen radius weight at the capstan, and both reach the key through their ratios.

## The quantities

- **The down weight and the up weight are measured without the wippen support springs.** The balance weight and the friction weight derive from those two readings: the balance weight is their mean, `(downWeight + upWeight) / 2`, and the friction weight their half difference, `(downWeight - upWeight) / 2`. A down weight measured with the springs serves only to weigh the springs.
- **The wippen's weight at the key is the wippen balance weight:** the key weight ratio times the wippen radius weight. When either one has not been measured, the analysis takes Stanwood's typical values, a key weight ratio of 0.5 and a wippen radius weight of 18 g (`src/lib/piano/touch-design/constants.ts`).
- **The support springs carry the difference between the two down weights:** the support spring balance weight is the down weight without the springs less the down weight with them, which assumes that the springs leave the friction unchanged.
- **A measured strike weight ratio wins over the computed one.** The analysis computes the ratio of every key from its other readings and keeps it beside the measured one, and the equations use the measured one when there is one.

## The equation of balance

- **The front weight plus the balance weight equals the wippen balance weight plus the strike weight ratio times the strike weight,** where the balance weight is the one without the springs. Every computation of the analysis and the design is this equation solved for one of its terms:
  - the strike weight ratio of a key: `(frontWeight + balanceWeight - wippenBalanceWeight) / strikeWeight`;
  - the front weight that a target balance asks for: `wippenBalanceWeight + strikeWeightRatio * strikeWeight - targetBalanceWeight - supportSpringBalanceWeight`;
  - the strike weight that a target balance asks for: `(targetBalanceWeight + frontWeight + supportSpringBalanceWeight - wippenBalanceWeight) / strikeWeightRatio`;
  - the balance weight that a design gives: `strikeWeight * strikeWeightRatio + wippenBalanceWeight - frontWeight`, rounded to the tenth of a gram, with the up and down weights of the preview at that balance weight less and plus the friction weight.
- **A design targets the balance weight a hand feels:** the balance weight less what the support springs carry. The calculators size the front weight or the strike weight so that the felt balance weight lands on the target, and every place that compares a balance weight with a target, or names the balance weight of a design, reads it through `feltBalanceWeight`, so that a design with springs is never shown one spring's worth above its target.

## Missing readings

- **A computation returns `null` when a reading it needs is missing,** and the readings each one needs are:
  - the strike weight ratio of the analysis: the strike weight, the front weight, and the up and down weights;
  - the front weight of a design: the strike weight, the strike weight ratio, the friction weight and the wippen balance weight;
  - the strike weight of a design: the front weight, the strike weight ratio, the friction weight and the wippen balance weight;
  - the preview of a design: the front weight, the strike weight, the strike weight ratio, the friction weight and the wippen balance weight.

  The calculators also ask for the friction weight, which their equation does not use.

- **Support springs that were not measured count as none:** a missing support spring balance weight is 0 g in every computation, so that a piano measured without the spring option still gets its designs.
- **A strike weight, a strike weight ratio, a key weight ratio or a wippen radius weight of 0 counts as a field left blank,** since none of them can weigh nothing, while a front weight, a friction weight or a balance weight of 0 g is a reading. The calculators and the preview refuse such a 0, and the analysis refuses a strike weight of 0; the analysis still takes a key weight ratio, a wippen radius weight or a measured strike weight ratio of 0 as a reading, where it should fall back as for a missing one (planned).
- **The terms divided by,** the strike weight and the strike weight ratio, are checked before the division.

## Standard curves and reference zones

- **The standard curves are Stanwood's, for 88 keys:** the front weight curves, levels 5 to 9, and the strike weight curves, levels 1 to 13 (`src/lib/piano/touch-design/data/`). The curves the interface draws are rebuilt from five keypoints per level, at keys 1, 22, 44, 66 and 88, and interpolated by a cubic spline: for the front weight, a linear formula of the level (`generate-custom-front-weight-keypoints.ts`), which the design extends to levels 1 to 4 and 10 to 12; for the strike weight, the keypoints of each level (`strikeWeightKeyPointsByLevel`).
- **A keyboard of another size gets the curves rescaled to its number of keys:** keypoint `k` of 88 moves to the key at the same fraction of the keyboard (hypothesis: rescaling, rather than aligning the curves note by note, is what Stanwood intends for a keyboard that does not span A0 to C8; to check against his writings).
- **The friction reference zones run from the bass to the treble:** the medium zone is centered on 15 g at the first key and 11 g at the last, linearly between them, 2 g on either side; the high and low zones are 4 g wide, above and below it.

## The adjustment sheet

- **A bench change is worked out from the weights as the sheet prints them,** to the tenth of a gram, with the rounding of `Intl.NumberFormat`, so that the printed reading plus the printed change always equals the printed target.
- **A change under 0.1 g is not worth a trip to the bench:** the sheet calls such a key unchanged, and its legend and its summary count by the same threshold (`ADJUSTMENT_THRESHOLD`).
