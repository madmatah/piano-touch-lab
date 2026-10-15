export interface GlossaryTerm {
  abbreviation: string;
  description: string;
  /** The formula the quantity is derived from, when there is one. */
  formula?: string;
  name: string;
}

export interface GlossaryProps {
  terms: GlossaryTerm[];
}

/** The quantities of the metrology, one card each. */
export const Glossary = ({ terms }: GlossaryProps) => (
  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-3">
    {terms.map((term) => (
      <dl
        key={term.abbreviation}
        id={`term-${term.abbreviation}`}
        className="m-0 grid scroll-mt-24 grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-1 rounded-md border border-border bg-card px-[18px] py-4"
      >
        <dt className="row-span-3 m-0 font-mono text-xl font-semibold text-ptl-brass">
          {term.abbreviation}
        </dt>
        <dd className="m-0 text-[15.5px] font-semibold text-foreground">
          {term.name}
        </dd>
        <dd className="m-0 text-sm leading-[1.55] text-muted-foreground">
          {term.description}
        </dd>
        {term.formula ? (
          <dd className="m-0 pt-1 font-mono text-[13px] text-foreground">
            {term.formula}
          </dd>
        ) : null}
      </dl>
    ))}
  </div>
);
