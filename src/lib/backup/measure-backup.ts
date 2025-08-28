import { z } from 'zod';
import type {
  MeasuredKeyRequirements,
  OptionalNumber,
} from '@/lib/piano/touch-design/measured-key.requirements';

export const OptionalNumberSchema = z.number().nullable();

export interface MeasureBackupRequirements {
  keys: MeasuredKeyRequirements[];
  keyWeightRatio: OptionalNumber;
  wippenRadiusWeight: OptionalNumber;
}

export const KeyMeasureSchema = z
  .object({
    downWeight: OptionalNumberSchema.optional(),
    frontWeight: OptionalNumberSchema.optional(),
    keyWeightRatio: OptionalNumberSchema.optional(),
    strikeWeight: OptionalNumberSchema.optional(),
    upWeight: OptionalNumberSchema.optional(),
    wippenRadiusWeight: OptionalNumberSchema.optional(),
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

export const makeFileSchema = (expectedLength: number) =>
  z
    .object({
      createdAt: z.string().optional(),
      data: makeDataSchema(expectedLength),
      profile: z.string().optional(),
    })
    .strict();

export type MeasuresData = z.infer<ReturnType<typeof makeDataSchema>>;

export type ParseResult =
  | { data: MeasuresData; ok: true }
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

  const fileSchema = makeFileSchema(expectedLength);
  const fileResult = fileSchema.safeParse(parsed);
  if (fileResult.success) {
    return { data: fileResult.data.data, ok: true };
  }

  const dataSchema = makeDataSchema(expectedLength);
  const dataResult = dataSchema.safeParse(parsed);
  if (dataResult.success) {
    return { data: dataResult.data, ok: true };
  }

  return { error: 'Invalid file format', ok: false };
}

export function buildMeasuresExportPayload(
  measures: MeasureBackupRequirements,
  profile: string = 'default',
) {
  return {
    createdAt: new Date().toISOString(),
    data: measures,
    profile,
  };
}

export function createMeasuresExportBlob(payload: unknown): Blob {
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
}
