export interface GlossaryProps {
  terms: {
    abbreviation: string;
    name: string;
    description: string;
  }[];
}

export const Glossary: React.FC<GlossaryProps> = ({ terms }) => (
  <ul className="list-disc pl-6 flex flex-col gap-2 mt-5">
    {terms.map((term, index) => (
      <li key={`term-${index}`}>
        <strong>{term.abbreviation}</strong>: {term.name}
      </li>
    ))}
  </ul>
);
