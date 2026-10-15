export interface MeasureField<Property extends string> {
  keyNumber: number;
  property: Property;
}

/**
 * The field Tab moves to in the measuring table.
 *
 * A technician goes down the keyboard once per pass, gauge in hand: Tab walks
 * the fields of a pass key by key — the down weight then the up weight of the
 * first key, then of the second — and on to the next pass after the last key.
 * Null at either end of the table, where Tab leaves it the browser's way.
 */
export const nextMeasureField = <Property extends string>(
  passes: readonly (readonly Property[])[],
  keyCount: number,
  from: MeasureField<Property>,
  direction: 1 | -1,
): MeasureField<Property> | null => {
  // Number every field in the order Tab visits them, find the one it is on,
  // and read back the one beside it.
  const starts: number[] = [];
  let total = 0;
  for (const fields of passes) {
    starts.push(total);
    total += fields.length * keyCount;
  }

  const passIndex = passes.findIndex((fields) =>
    fields.includes(from.property),
  );
  if (passIndex === -1) {
    return null;
  }
  const fields = passes[passIndex]!;
  const position =
    starts[passIndex]! +
    (from.keyNumber - 1) * fields.length +
    fields.indexOf(from.property) +
    direction;
  if (position < 0 || position >= total) {
    return null;
  }

  const nextPass = starts.findLastIndex((start) => start <= position);
  const nextFields = passes[nextPass]!;
  const offset = position - starts[nextPass]!;
  return {
    keyNumber: Math.floor(offset / nextFields.length) + 1,
    property: nextFields[offset % nextFields.length]!,
  };
};
