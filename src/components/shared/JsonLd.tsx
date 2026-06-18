/** Renders a JSON-LD <script> block. Server-rendered for crawler visibility. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
