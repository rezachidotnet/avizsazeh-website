import type { LocalizedString } from '@/lib/site';

/**
 * Ceiling-system decision matrix. Honest, design-oriented fit levels — not
 * certified ratings. Unknown engineering values stay "needs review" rather than
 * being overstated. Values are keyed by system slug.
 */
export type FitLevel = 'excellent' | 'suitable' | 'review' | 'no';

export const fitLabels: Record<FitLevel, LocalizedString> = {
  excellent: { fa: 'عالی', en: 'Excellent' },
  suitable: { fa: 'مناسب', en: 'Suitable' },
  review: { fa: 'نیازمند بررسی', en: 'Needs review' },
  no: { fa: 'پیشنهاد نمی‌شود', en: 'Not recommended' },
};

export type CompareRow = {
  criterion: LocalizedString;
  /** keyed by system slug */
  values: Record<string, FitLevel>;
};

/** slug order used by the matrix columns */
export const compareColumns = ['linear-ceiling', 'open-cell', 'metal-tile', 'baffle'];

export const compareRows: CompareRow[] = [
  {
    criterion: { fa: 'فضاهای بزرگ‌مقیاس / فرودگاه', en: 'Large-scale spaces / airports' },
    values: { 'linear-ceiling': 'excellent', 'open-cell': 'excellent', 'metal-tile': 'suitable', baffle: 'suitable' },
  },
  {
    criterion: { fa: 'مراکز تجاری و مال‌ها', en: 'Commercial centres & malls' },
    values: { 'linear-ceiling': 'suitable', 'open-cell': 'excellent', 'metal-tile': 'suitable', baffle: 'suitable' },
  },
  {
    criterion: { fa: 'بیمارستان / فضای استریل', en: 'Hospital / sterile space' },
    values: { 'linear-ceiling': 'no', 'open-cell': 'no', 'metal-tile': 'review', baffle: 'no' },
  },
  {
    criterion: { fa: 'کنترل آکوستیک', en: 'Acoustic control' },
    values: { 'linear-ceiling': 'review', 'open-cell': 'review', 'metal-tile': 'suitable', baffle: 'excellent' },
  },
  {
    criterion: { fa: 'دسترسی سریع به پلنوم', en: 'Fast plenum access' },
    values: { 'linear-ceiling': 'suitable', 'open-cell': 'excellent', 'metal-tile': 'suitable', baffle: 'excellent' },
  },
  {
    criterion: { fa: 'یکپارچگی با MEP', en: 'MEP integration' },
    values: { 'linear-ceiling': 'suitable', 'open-cell': 'excellent', 'metal-tile': 'suitable', baffle: 'suitable' },
  },
  {
    criterion: { fa: 'امکان اجرای منحنی یا موج‌دار', en: 'Curved or wavy execution' },
    values: { 'linear-ceiling': 'excellent', 'open-cell': 'review', 'metal-tile': 'no', baffle: 'excellent' },
  },
  {
    criterion: { fa: 'عمق بصری و ریتم معماری', en: 'Visual depth & architectural rhythm' },
    values: { 'linear-ceiling': 'excellent', 'open-cell': 'suitable', 'metal-tile': 'review', baffle: 'excellent' },
  },
  {
    criterion: { fa: 'نگهداری و تعویض آسان', en: 'Easy maintenance & replacement' },
    values: { 'linear-ceiling': 'suitable', 'open-cell': 'excellent', 'metal-tile': 'excellent', baffle: 'suitable' },
  },
  {
    criterion: { fa: 'مناسب برای سیستم تابشی CBI Europe', en: 'Suited to CBI Europe radiant systems' },
    values: { 'linear-ceiling': 'review', 'open-cell': 'no', 'metal-tile': 'excellent', baffle: 'no' },
  },
  {
    criterion: { fa: 'مناسب‌ترین گزینه اقتصادی', en: 'Most economical option' },
    values: { 'linear-ceiling': 'review', 'open-cell': 'suitable', 'metal-tile': 'suitable', baffle: 'review' },
  },
  {
    criterion: { fa: 'نیاز به دیتاشیت مهندسی', en: 'Needs an engineering datasheet' },
    values: { 'linear-ceiling': 'review', 'open-cell': 'review', 'metal-tile': 'review', baffle: 'review' },
  },
];
