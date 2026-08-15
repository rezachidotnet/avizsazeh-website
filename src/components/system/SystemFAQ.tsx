import type { Locale } from '@/i18n/routing';
import type { Faq } from '@/lib/content/systems';
import { localized } from '@/lib/site';
import { TrackedFAQDetails } from './TrackedFAQDetails';

/**
 * System FAQ. Server-rendered native <details> accordion so it works without
 * JavaScript and stays crawlable. Pair with FAQPage JSON-LD on the page.
 */
export function SystemFAQ({
  locale,
  title,
  items,
  category,
}: {
  locale: Locale;
  title: string;
  items: Faq[];
  category: string;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="font-display text-h2 font-semibold text-white">{title}</h2>
      </div>
      <div className="lg:col-span-8">
        <div className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
          {items.map((item, index) => {
            const question = localized(item.q, locale).trim();
            return (
              <TrackedFAQDetails
                key={item.id}
                question={question}
                answer={localized(item.a, locale)}
                analytics={{
                  faq_id: item.id,
                  faq_question: question,
                  faq_category: category,
                  faq_position: index + 1,
                  page_language: locale,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
