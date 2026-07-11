'use client';

import { useTranslations } from 'next-intl';
import { useConsentUi } from './ConsentProvider';

export function ConsentSettingsButton() {
  const t = useTranslations('consent');
  const { openPreferences } = useConsentUi();

  return (
    <button
      type="button"
      className="whitespace-nowrap transition-colors hover:text-white"
      onClick={openPreferences}
    >
      {t('settingsButton')}
    </button>
  );
}
