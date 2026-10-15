/** A string as CSS writes one: quoted, its quotes and backslashes escaped. */
const cssString = (text: string): string =>
  `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\a ')}"`;

export interface PrintMargins {
  /** Bottom left of every sheet: which instrument, and when. */
  identity: string;
  /** The word before the page number: `page` 2 / 4. */
  pageLabel: string;
}

/**
 * The `@page` rule that writes into the margin of every printed sheet.
 *
 * A sheet that leaves the workshop with nothing on it but a title — "Front
 * weight" — cannot be told from the same sheet of another piano. The margin
 * boxes say which piano and when on every sheet, and number them, without
 * taking a line from the figure: they are drawn in the margin the sheet keeps
 * anyway. Only the content is written here; how it looks is in the print
 * stylesheet.
 */
export const printMarginsRule = ({
  identity,
  pageLabel,
}: PrintMargins): string =>
  `@page { @bottom-left { content: ${cssString(identity)} } ` +
  `@bottom-right { content: ${cssString(`${pageLabel} `)} counter(page) " / " counter(pages) } }`;
