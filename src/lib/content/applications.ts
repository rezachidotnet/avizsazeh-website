import type { Locale } from '@/i18n/routing';
import type { Faq } from './systems';

/**
 * Application (use-case) landing pages — the commercial, buyer-intent layer of
 * the topic cluster. Each page targets a transactional application keyword
 * (airport / commercial metal ceiling) while keeping the engineering-led,
 * premium B2B voice. No fabricated project metrics: hard numbers stay with the
 * verified case studies.
 */

export type ApplicationChallenge = { title: Record<Locale, string>; text: Record<Locale, string> };

export type Application = {
  slug: string;
  /** primary commercial keyword (also the internal-link anchor) */
  keyword: Record<Locale, string>;
  eyebrow: Record<Locale, string>;
  seo: { title: Record<Locale, string>; description: Record<Locale, string> };
  h1: Record<Locale, string>;
  lead: Record<Locale, string>;
  /** the spaces / facilities this application covers */
  useCases: Record<Locale, string[]>;
  /** the engineering / architectural challenges of the application */
  challenges: ApplicationChallenge[];
  /** what the ceiling must satisfy here (engineering requirements) */
  requirements: Record<Locale, string[]>;
  /** system slugs that fit this application, best-first */
  suitableSystems: string[];
  /** project case-study slugs to surface as proof */
  relatedProjects: string[];
  faq: Faq[];
  cover: string;
  coverAlt: Record<Locale, string>;
};

export const applications: Application[] = [
  /* ───────────────────────────── AIRPORT ───────────────────────────── */
  {
    slug: 'airport-ceiling',
    keyword: { fa: 'سقف کاذب فرودگاه', en: 'Airport metal ceiling' },
    eyebrow: { fa: 'کاربرد · زیرساخت فرودگاهی', en: 'Application · Airport infrastructure' },
    seo: {
      title: {
        fa: 'سقف کاذب فرودگاه | سقف فلزی فرودگاه و پایانه حمل‌ونقل آویزسازه',
        en: 'Airport Metal Ceiling | Suspended Ceiling Systems for Terminals | AvizSazeh',
      },
      description: {
        fa: 'سقف کاذب فرودگاه و سقف فلزی فرودگاه مهندسی‌شده آویزسازه برای پایانه‌های حمل‌ونقل؛ سقف خطی فلزی، گریلیوم و تایل فلزی با هماهنگی روشنایی، تهویه و حریق برای فضاهای بزرگ‌مقیاس.',
        en: 'Engineered airport metal ceiling and airport suspended ceiling systems by AvizSazeh for transport terminals — linear, open cell and metal tile ceilings coordinated with lighting, HVAC and fire safety across large-scale spaces.',
      },
    },
    h1: {
      fa: 'سقف کاذب فرودگاه؛ سیستم سقف فلزی مهندسی‌شده برای پایانه‌های حمل‌ونقل',
      en: 'Airport Metal Ceiling — Engineered Suspended Ceiling Systems for Transport Terminals',
    },
    lead: {
      fa: 'سقف کاذب فرودگاه یک سطح معماری ساده نیست؛ یک سیستم سقف فلزی بزرگ‌مقیاس است که باید با روشنایی، تهویه، اعلام و اطفای حریق، علائم مسیریابی و نگهداری بلندمدت هماهنگ شود. آویزسازه سقف فلزی فرودگاه را به‌صورت سیستم مهندسی — از نقشه اجرایی تا نصب در ارتفاع — تعریف، تولید و اجرا می‌کند.',
      en: 'An airport metal ceiling is never a plain architectural surface; it is a large-scale suspended ceiling system that must coordinate with lighting, HVAC, fire detection and suppression, wayfinding and long-term maintenance. AvizSazeh defines, manufactures and installs the airport metal ceiling as an engineered system — from shop drawings to installation at height.',
    },
    useCases: {
      fa: [
        'سالن‌های ورود و خروج مسافر',
        'پایانه‌های حمل‌ونقل و سالن ترانزیت',
        'محوطه چک‌این، گیت و تحویل بار',
        'راهروهای طولانی و فضاهای دوبلکس بزرگ‌مقیاس',
      ],
      en: [
        'Departure and arrival halls',
        'Transport terminals and transit concourses',
        'Check-in, gate and baggage-claim areas',
        'Long corridors and large double-height spaces',
      ],
    },
    challenges: [
      {
        title: { fa: 'مقیاس و تداوم بصری', en: 'Scale and visual continuity' },
        text: {
          fa: 'فضاهای فرودگاهی بسیار بزرگ و پیوسته‌اند؛ سقف باید ریتم منظم و یکپارچه را در دهانه‌های وسیع حفظ کند بدون اینکه تراز و خط آن بشکند.',
          en: 'Airport spaces are vast and continuous; the ceiling must hold a regular, unified rhythm across wide spans without breaking line or level.',
        },
      },
      {
        title: { fa: 'یکپارچگی تأسیسات (MEP)', en: 'MEP integration' },
        text: {
          fa: 'روشنایی، تهویه، دتکتور و اسپرینکلر باید با ماژول سقف هماهنگ شوند و دسترسی به پلنوم برای نگهداری بدون توقف بهره‌برداری حفظ شود.',
          en: 'Lighting, HVAC, detectors and sprinklers must align with the ceiling module while keeping plenum access for maintenance without stopping operations.',
        },
      },
      {
        title: { fa: 'اجرا در ارتفاع', en: 'Installation at height' },
        text: {
          fa: 'نصب در ارتفاع زیاد، کنترل تراز، اتصالات و آویزها و تلرانس اجرا را به یک مسئله مهندسی تبدیل می‌کند؛ نه صرفاً یک کار نصب.',
          en: 'Installing at significant height turns level control, connections, hangers and tolerance into an engineering problem — not a simple fit-out task.',
        },
      },
      {
        title: { fa: 'دوام و ایمنی بلندمدت', en: 'Long-term durability and safety' },
        text: {
          fa: 'سقف فرودگاه باید سال‌ها در محیط پرتردد دوام بیاورد و الزامات ایمنی و حریق پروژه را برآورده کند؛ مقادیر گواهی‌شده برای هر پروژه تأیید می‌شوند.',
          en: 'An airport ceiling must last for years in a high-traffic environment and meet the project’s safety and fire requirements; certified values are confirmed per project.',
        },
      },
    ],
    requirements: {
      fa: [
        'نقشه اجرایی اختصاصی و کنترل هندسه سقف در دهانه‌های بزرگ',
        'هماهنگی کامل با روشنایی، تهویه و سیستم‌های حریق',
        'دسترسی کنترل‌شده به پلنوم برای نگهداری',
        'منطق نصب و توالی اجرا برای کار در ارتفاع',
        'انتخاب متریال و پوشش متناسب با دوام و ایمنی',
      ],
      en: [
        'Dedicated shop drawings and ceiling-geometry control over large spans',
        'Full coordination with lighting, HVAC and fire-safety systems',
        'Controlled plenum access for maintenance',
        'Installation logic and execution sequence for work at height',
        'Material and finish selection matched to durability and safety',
      ],
    },
    suitableSystems: ['linear-ceiling', 'open-cell', 'metal-tile'],
    relatedProjects: ['imam-khomeini-airport'],
    faq: [
      {
        q: { fa: 'مناسب‌ترین سیستم سقف کاذب برای فرودگاه چیست؟', en: 'Which ceiling system is best for an airport?' },
        a: {
          fa: 'انتخاب میان سقف خطی فلزی، گریلیوم و تایل فلزی به هندسه فضا، ارتفاع، نیاز به دسترسی به تأسیسات و بیان معماری بستگی دارد. سقف خطی برای ریتم و مسیریابی، گریلیوم برای دسترسی و عمق بصری و تایل برای نظم و نگهداری مناسب است؛ انتخاب نهایی پس از بررسی مهندسی انجام می‌شود.',
          en: 'The choice between a linear metal ceiling, open cell and metal tile depends on geometry, height, service-access needs and architectural intent. Linear suits rhythm and wayfinding, open cell suits access and visual depth, and tile suits order and maintenance; the final choice follows an engineering review.',
        },
      },
      {
        q: { fa: 'سقف فلزی فرودگاه تا چه ارتفاعی قابل اجراست؟', en: 'To what height can an airport metal ceiling be installed?' },
        a: {
          fa: 'آویزسازه تجربه اجرای سقف فلزی در ارتفاع‌های زیاد را دارد و نصب در ارتفاع را به‌صورت یک مسئله مهندسی با منطق تعلیق و کنترل تراز مدیریت می‌کند. ارتفاع و جزئیات اجرایی هر پروژه پس از بررسی نقشه تأیید می‌شود.',
          en: 'AvizSazeh has experience installing metal ceilings at significant heights and manages installation at height as an engineering problem with a defined suspension logic and level control. The exact height and execution details are confirmed per project after drawing review.',
        },
      },
      {
        q: { fa: 'آیا سقف فرودگاه با روشنایی و تأسیسات هماهنگ می‌شود؟', en: 'Is the airport ceiling coordinated with lighting and services?' },
        a: {
          fa: 'بله. جانمایی روشنایی، تهویه، دتکتور و اسپرینکلر با ماژول و ریتم سقف در نقشه اجرایی هماهنگ می‌شود تا نتیجه نهایی منظم، متقارن و قابل نگهداری باشد.',
          en: 'Yes. Lighting, HVAC, detectors and sprinklers are coordinated with the ceiling module and rhythm in the shop drawings so the result is regular, symmetrical and maintainable.',
        },
      },
    ],
    cover: '/design-system/linear-ceiling.png',
    coverAlt: {
      fa: 'سقف کاذب فرودگاه؛ اجرای سقف خطی فلزی در پایانه حمل‌ونقل بزرگ‌مقیاس',
      en: 'Airport metal ceiling — linear metal ceiling installed in a large-scale transport terminal',
    },
  },

  /* ──────────────────────────── COMMERCIAL ─────────────────────────── */
  {
    slug: 'commercial-ceiling',
    keyword: { fa: 'سقف کاذب تجاری', en: 'Commercial metal ceiling' },
    eyebrow: { fa: 'کاربرد · فضاهای تجاری و مال', en: 'Application · Retail & malls' },
    seo: {
      title: {
        fa: 'سقف کاذب تجاری | سقف فلزی مراکز خرید و فضاهای تجاری آویزسازه',
        en: 'Commercial Metal Ceiling | Suspended Ceilings for Malls & Retail | AvizSazeh',
      },
      description: {
        fa: 'سقف کاذب تجاری و سقف کاذب مرکز خرید مهندسی‌شده آویزسازه؛ سقف گریلیوم، بافل، خطی و تایل فلزی با هماهنگی روشنایی و تأسیسات برای مال‌ها، مجتمع‌های تجاری و فروشگاه‌ها.',
        en: 'Engineered commercial metal ceiling and commercial suspended ceiling systems by AvizSazeh — open cell, baffle, linear and metal tile ceilings coordinated with lighting and services for malls, retail centres and stores.',
      },
    },
    h1: {
      fa: 'سقف کاذب تجاری؛ سیستم سقف فلزی برای مراکز خرید و فضاهای تجاری',
      en: 'Commercial Metal Ceiling — Suspended Ceiling Systems for Malls and Retail',
    },
    lead: {
      fa: 'سقف کاذب تجاری باید هم‌زمان هویت بصری برند فضا را بسازد و دسترسی به تأسیسات پرتردد را حفظ کند. آویزسازه سقف کاذب مرکز خرید و فضاهای تجاری را به‌عنوان سیستم سقف فلزی مهندسی‌شده — از طراحی تا اجرا — تعریف می‌کند تا نتیجه هم چشمگیر باشد و هم قابل نگهداری.',
      en: 'A commercial metal ceiling must build the visual identity of the space while keeping high-traffic services accessible. AvizSazeh defines the commercial and mall metal ceiling as an engineered suspended ceiling system — from design to execution — so the result is both striking and maintainable.',
    },
    useCases: {
      fa: [
        'مراکز خرید و مال‌ها',
        'مجتمع‌های تجاری و فروشگاه‌های بزرگ',
        'فودکورت، لابی و فضاهای عمومی تجاری',
        'بانک، نمایندگی و فضاهای خدماتی',
      ],
      en: [
        'Shopping centres and malls',
        'Commercial complexes and large stores',
        'Food courts, lobbies and public retail areas',
        'Banks, showrooms and service spaces',
      ],
    },
    challenges: [
      {
        title: { fa: 'هویت بصری و برند فضا', en: 'Visual identity and brand of the space' },
        text: {
          fa: 'سقف بخش بزرگی از تجربه بصری مشتری در فضای تجاری است و باید ریتم، عمق و کیفیت معماری مدنظر طراح را دقیق اجرا کند.',
          en: 'The ceiling is a large part of the customer’s visual experience in retail and must execute the designer’s intended rhythm, depth and architectural quality precisely.',
        },
      },
      {
        title: { fa: 'دسترسی در فضای پرتردد', en: 'Access in high-traffic space' },
        text: {
          fa: 'تعمیر و نگهداری تأسیسات نباید بهره‌برداری تجاری را مختل کند؛ سقف باید دسترسی سریع به پلنوم را فراهم کند.',
          en: 'Maintaining services must not disrupt retail operation; the ceiling has to provide fast plenum access.',
        },
      },
      {
        title: { fa: 'هماهنگی نور و تأسیسات', en: 'Lighting and service coordination' },
        text: {
          fa: 'نورپردازی فروشگاهی، تهویه و حریق باید با ماژول سقف هماهنگ شوند تا فضای تجاری منظم و حرفه‌ای دیده شود.',
          en: 'Retail lighting, HVAC and fire systems must align with the ceiling module so the commercial space reads as orderly and professional.',
        },
      },
      {
        title: { fa: 'دوام و یکنواختی اجرا', en: 'Durability and consistent execution' },
        text: {
          fa: 'سقف تجاری باید در سطوح وسیع یکنواخت و بادوام اجرا شود و کیفیت آن تا تحویل نهایی کنترل شود.',
          en: 'A commercial ceiling must be executed uniformly and durably over large areas, with quality controlled through to final handover.',
        },
      },
    ],
    requirements: {
      fa: [
        'انتخاب سیستم متناسب با مفهوم معماری و بودجه پروژه',
        'دسترسی سریع به پلنوم برای نگهداری بدون اختلال',
        'هماهنگی نورپردازی، تهویه و حریق با ماژول سقف',
        'اجرای یکنواخت و بادوام در سطوح بزرگ',
        'کنترل کیفیت تا تحویل نهایی',
      ],
      en: [
        'System selection matched to the architectural concept and project budget',
        'Fast plenum access for maintenance without disruption',
        'Coordination of lighting, HVAC and fire systems with the ceiling module',
        'Uniform, durable execution across large areas',
        'Quality control through to final handover',
      ],
    },
    suitableSystems: ['open-cell', 'baffle', 'linear-ceiling', 'metal-tile'],
    relatedProjects: ['bushehr-mall'],
    faq: [
      {
        q: { fa: 'برای سقف کاذب مرکز خرید کدام سیستم مناسب است؟', en: 'Which system suits a mall ceiling?' },
        a: {
          fa: 'سقف گریلیوم برای دسترسی و عمق بصری، سقف بافل برای بیان معماری و آکوستیک، و سقف خطی فلزی برای ریتم و مسیریابی در مراکز خرید مناسب‌اند. انتخاب نهایی بر پایه مفهوم معماری، بودجه و الزامات اجرا و پس از بررسی مهندسی انجام می‌شود.',
          en: 'Open cell suits access and visual depth, baffle suits architectural expression and acoustics, and the linear metal ceiling suits rhythm and wayfinding in malls. The final choice is based on the architectural concept, budget and execution requirements after an engineering review.',
        },
      },
      {
        q: { fa: 'آیا سقف کاذب تجاری امکان دسترسی به تأسیسات را حفظ می‌کند؟', en: 'Does a commercial metal ceiling keep services accessible?' },
        a: {
          fa: 'بله. سیستم‌هایی مانند گریلیوم و بافل دسترسی سریع به پلنوم را فراهم می‌کنند و تایل فلزی امکان بازشدن کنترل‌شده تایل را دارد؛ این یعنی نگهداری بدون اختلال در بهره‌برداری تجاری.',
          en: 'Yes. Systems like open cell and baffle provide fast plenum access, and metal tile allows controlled tile removal — meaning maintenance without disrupting retail operation.',
        },
      },
      {
        q: { fa: 'آیا آویزسازه طراحی و اجرا را با هم انجام می‌دهد؟', en: 'Does AvizSazeh handle both design and execution?' },
        a: {
          fa: 'بله. آویزسازه سقف کاذب تجاری را به‌صورت سیستم کامل — طراحی، نقشه اجرایی، تولید و نصب — تحویل می‌دهد، نه صرفاً فروش مصالح.',
          en: 'Yes. AvizSazeh delivers the commercial metal ceiling as a complete system — design, shop drawings, manufacturing and installation — not merely a material sale.',
        },
      },
    ],
    cover: '/design-system/open-cell.png',
    coverAlt: {
      fa: 'سقف کاذب تجاری؛ اجرای سقف گریلیوم فلزی در مرکز خرید',
      en: 'Commercial metal ceiling — open cell metal ceiling installed in a shopping centre',
    },
  },
];

export const applicationSlugs = applications.map((a) => a.slug);

export function getApplication(slug: string): Application | undefined {
  return applications.find((a) => a.slug === slug);
}
