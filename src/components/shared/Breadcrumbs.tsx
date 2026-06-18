import { Link } from '@/i18n/routing';

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string; current?: boolean }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-caption text-ink-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {item.current ? (
              <span aria-current="page" className="text-ink-600">
                {item.name}
              </span>
            ) : (
              <Link href={item.path} className="transition-colors hover:text-ink">
                {item.name}
              </Link>
            )}
            {i < items.length - 1 ? <span className="text-ink-300">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
