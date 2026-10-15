export interface FigureCaptionProps {
  children: React.ReactNode;
  /** The figure number, e.g. `02.2`. Omitted on the design charts. */
  number?: string;
}

/** What the figure shows, under a rule at the foot of the frame. */
export const FigureCaption = ({ children, number }: FigureCaptionProps) => (
  <figcaption className="border-t border-border px-[18px] pt-3 pb-4 text-[13px] leading-[1.55] text-muted-foreground">
    {number ? (
      <>
        <span className="font-mono text-foreground">Fig. {number}</span>
        {' — '}
      </>
    ) : null}
    {children}
  </figcaption>
);
