import { z } from 'zod';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';
import type { DesignStoreState } from '@/hooks/store/use-design-store';
import type { MeasureOptionsStoreState } from '@/hooks/store/use-measure-options-store';
import type { PianoProfileStoreState } from '@/hooks/store/use-piano-profile-store';
import { FrontWeightDesignMode } from '@/components/design/front-weight/FrontWeightDesign.types';
import { StrikeWeightDesignMode } from '@/components/design/strike-weight/StrikeWeightDesign.types';
import { StrikeWeightRatioDesignMode } from '@/components/design/strike-weight-ratio/StrikeWeightRatioDesign.types';
import { WippenSupportSpringsDesignMode } from '@/components/design/wippen-support-springs/WippenSupportSpringsDesign.types';

export const OptionalNumberSchema = z.number().nullable();

export interface MeasureBackupRequirements {
  keys: MeasuredKeyRequirements[];
  keyWeightRatio: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}

export type DesignBackupRequirements = DesignStoreState;

export type MeasureOptionsBackupRequirements = MeasureOptionsStoreState;

export type PianoBackupRequirements = Omit<
  PianoProfileStoreState,
  'isDemoProfile'
>;

export interface FullBackupRequirements {
  measures: MeasureBackupRequirements;
  design: DesignBackupRequirements;
  measureOptions: MeasureOptionsBackupRequirements;
  piano?: PianoBackupRequirements;
}

export const KeyMeasureSchema = z
  .object({
    downWeight: OptionalNumberSchema.optional(),
    downWeightWithSpringSupport: OptionalNumberSchema.optional(),
    downWeightWithoutSpringSupport: OptionalNumberSchema.optional(),
    frontWeight: OptionalNumberSchema.optional(),
    keyWeightRatio: OptionalNumberSchema.optional(),
    measuredStrikeWeightRatio: OptionalNumberSchema.optional(),
    strikeWeight: OptionalNumberSchema.optional(),
    upWeight: OptionalNumberSchema.optional(),
    wippenRadiusWeight: OptionalNumberSchema.optional(),
  })
  .strict();

export const DesignBackupSchema = z
  .object({
    frontWeightDesignComputedBalanceWeightTarget: z.number().nullable(),
    frontWeightDesignMode: z.nativeEnum(FrontWeightDesignMode).nullable(),
    frontWeightDesignStandardTarget: z.number().nullable(),
    frontWeightDesignTarget: z.number().nullable(),
    strikeWeightDesignComputedBalanceWeightTarget: z.number().nullable(),
    strikeWeightDesignLatestSmoothTarget: z
      .union([z.string(), z.number()])
      .nullable(),
    strikeWeightDesignLatestStandarTarget: z
      .union([z.string(), z.number()])
      .nullable(),
    strikeWeightDesignMode: z.nativeEnum(StrikeWeightDesignMode).nullable(),
    strikeWeightDesignTarget: z.union([z.string(), z.number()]).nullable(),
    strikeWeightRatioDesignLatestFixedTarget: z.number().nullable(),
    strikeWeightRatioDesignLatestSmoothTarget: z
      .union([z.string(), z.number()])
      .nullable(),
    strikeWeightRatioDesignMode: z
      .nativeEnum(StrikeWeightRatioDesignMode)
      .nullable(),
    strikeWeightRatioDesignTarget: z.number().nullable(),
    wippenSupportSpringsDesignLatestNumberOfSprings: z.number().nullable(),
    wippenSupportSpringsDesignLatestSpringBalanceWeight: z.number().nullable(),
    wippenSupportSpringsDesignLatestTensionDropIndex: z.number().nullable(),
    wippenSupportSpringsDesignMode: z
      .nativeEnum(WippenSupportSpringsDesignMode)
      .nullable(),
    wippenSupportSpringsDesignTarget: z.any(),
  })
  .strict();

export const MeasureOptionsBackupSchema = z
  .object({
    useManualSWRMeasurements: z.boolean(),
    useSupportSpringMeasurements: z.boolean(),
  })
  .strict();

export const PianoBackupSchema = z
  .object({
    isDemoProfile: z.boolean().optional(),
    keyCount: z.number().optional(),
    brand: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    serialNumber: z.string().nullable().optional(),
  })
  .strict();

export const makeDataSchema = (expectedLength: number) =>
  z
    .object({
      keyWeightRatio: OptionalNumberSchema.optional(),
      keys: z.array(KeyMeasureSchema).length(expectedLength),
      wippenRadiusWeight: OptionalNumberSchema.optional(),
    })
    .strict();

export const makeFullDataSchema = (expectedLength: number) =>
  z
    .object({
      design: DesignBackupSchema,
      measureOptions: MeasureOptionsBackupSchema,
      measures: makeDataSchema(expectedLength),
      piano: PianoBackupSchema.optional(),
    })
    .strict();

export const makeFileSchema = (expectedLength: number) =>
  z
    .object({
      createdAt: z.string().optional(),
      data: makeDataSchema(expectedLength),
      profile: z.string().optional(),
    })
    .strict();

export const makeFullFileSchema = (expectedLength: number) =>
  z
    .object({
      createdAt: z.string().optional(),
      data: makeFullDataSchema(expectedLength),
      profile: z.string().optional(),
    })
    .strict();

export type MeasuresData = z.infer<ReturnType<typeof makeDataSchema>>;
export type FullBackupData = z.infer<ReturnType<typeof makeFullDataSchema>>;

export type ParseResult =
  | { data: MeasuresData; ok: true; isFullBackup: false }
  | { data: FullBackupData; ok: true; isFullBackup: true }
  | { error: string; ok: false };

export function parseMeasuresBackupText(
  jsonText: string,
  expectedLength: number,
): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { error: 'Invalid JSON', ok: false };
  }

  const fullFileSchema = makeFullFileSchema(expectedLength);
  const fullFileResult = fullFileSchema.safeParse(parsed);
  if (fullFileResult.success) {
    return { data: fullFileResult.data.data, isFullBackup: true, ok: true };
  }

  const fullDataSchema = makeFullDataSchema(expectedLength);
  const fullDataResult = fullDataSchema.safeParse(parsed);
  if (fullDataResult.success) {
    return { data: fullDataResult.data, isFullBackup: true, ok: true };
  }

  const fileSchema = makeFileSchema(expectedLength);
  const fileResult = fileSchema.safeParse(parsed);
  if (fileResult.success) {
    return { data: fileResult.data.data, isFullBackup: false, ok: true };
  }

  const dataSchema = makeDataSchema(expectedLength);
  const dataResult = dataSchema.safeParse(parsed);
  if (dataResult.success) {
    return { data: dataResult.data, isFullBackup: false, ok: true };
  }

  return { error: 'Invalid file format', ok: false };
}

export function buildMeasuresExportPayload(
  measures: MeasureBackupRequirements,
) {
  return {
    createdAt: new Date().toISOString(),
    data: measures,
  };
}

export function buildFullBackupExportPayload(
  fullBackup: FullBackupRequirements,
) {
  return {
    createdAt: new Date().toISOString(),
    data: fullBackup,
  };
}

export function createMeasuresExportBlob(payload: unknown): Blob {
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
}
