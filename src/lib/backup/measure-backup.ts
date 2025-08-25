import { z } from 'zod';
import type { MeasureRequirements } from '@/lib/piano/touch-design/measure-requirements';

export const OptionalNumberSchema = z.number().finite().nullable();

export const KeyMeasureSchema = z
  .object({
    downWeight: OptionalNumberSchema,
    frontWeight: OptionalNumberSchema,
    strikeWeight: OptionalNumberSchema,
    upWeight: OptionalNumberSchema,
  })
  .strict();

export const makeDataSchema = (expectedLength: number) =>
  z
    .object({
      keyWeightRatio: OptionalNumberSchema,
      keys: z.array(KeyMeasureSchema).length(expectedLength),
      wippenRadiusWeight: OptionalNumberSchema,
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
  measures: MeasureRequirements,
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
