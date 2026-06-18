import Image from 'next/image';
import { clients } from '@/lib/content/clients';
import { localized } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/** Real client / project logo wall — the proof layer. */
export function ClientWall({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink-200 bg-ink-200 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className,
      )}
    >
      {clients.map((client) => (
        <li
          key={client.file}
          className="group flex aspect-[3/2] items-center justify-center bg-white p-5"
          title={localized(client.name, locale)}
        >
          <Image
            src={`/clients/${client.file}`}
            alt={localized(client.name, locale)}
            width={160}
            height={90}
            loading="lazy"
            sizes="(max-width: 640px) 40vw, 160px"
            className="max-h-14 w-auto object-contain opacity-70 grayscale transition-all duration-medium ease-aecs group-hover:opacity-100 group-hover:grayscale-0"
          />
        </li>
      ))}
    </ul>
  );
}
