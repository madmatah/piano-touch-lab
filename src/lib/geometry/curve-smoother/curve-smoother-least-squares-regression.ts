import type { CurveSmootherRequirements } from './curve-smoother.requirements';

export interface CurveSmootherLeastSquaresRegressionOptions {
  referenceCurve: number[];
}

export class CurveSmootherLeastSquaresRegression
  implements
    CurveSmootherRequirements<CurveSmootherLeastSquaresRegressionOptions>
{
  public smoothCurve(
    inputData: (number | undefined)[],
    options: CurveSmootherLeastSquaresRegressionOptions,
  ): number[] {
    const { referenceCurve } = options;
    const { measured, ref } = this.extractPairedData(inputData, referenceCurve);
    if (!this.hasEnoughPairs(measured)) {
      return this.createNaNArray(inputData.length);
    }
    const { alpha, beta } = this.computeLinearFit(measured, ref);
    return this.buildOutput(inputData, referenceCurve, alpha, beta);
  }

  private extractPairedData(
    inputData: (number | undefined)[],
    referenceCurve: number[],
  ): { measured: number[]; ref: number[] } {
    const measured: number[] = [];
    const ref: number[] = [];
    inputData.forEach((val, i) => {
      if (val != null && !isNaN(val) && referenceCurve[i] != null) {
        measured.push(val);
        ref.push(referenceCurve[i]);
      }
    });
    return { measured, ref };
  }

  private hasEnoughPairs(measured: number[]): boolean {
    return measured.length >= 2;
  }

  private createNaNArray(length: number): number[] {
    return Array.from({ length }, () => NaN);
  }

  private computeLinearFit(
    measured: number[],
    ref: number[],
  ): { alpha: number; beta: number } {
    const n = measured.length;
    let sumR = 0;
    let sumY = 0;
    let sumRR = 0;
    let sumRY = 0;
    for (let k = 0; k < n; k++) {
      const r = ref[k]!;
      const y = measured[k]!;
      sumR += r;
      sumY += y;
      sumRR += r * r;
      sumRY += r * y;
    }
    const denom = Math.max(1e-8, n * sumRR - sumR * sumR);
    const alpha = (n * sumRY - sumR * sumY) / denom;
    const beta = sumY / n - alpha * (sumR / n);
    return { alpha, beta };
  }

  private buildOutput(
    inputData: (number | undefined)[],
    referenceCurve: number[],
    alpha: number,
    beta: number,
  ): number[] {
    return inputData.map((_, i) => {
      const r = referenceCurve[i];
      return r != null ? alpha * r + beta : NaN;
    });
  }
}
