'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useSyncExternalStore } from 'react';
import { getConsentSnapshot, subscribeConsent, type ConsentSnapshot } from '@/lib/consent';

type ConsentUiContextValue = {
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  snapshot: ConsentSnapshot;
};

const ConsentUiContext = createContext<ConsentUiContextValue | null>(null);

export function useConsentUi(): ConsentUiContextValue {
  const value = useContext(ConsentUiContext);
  if (!value) {
    throw new Error('useConsentUi must be used within ConsentProvider');
  }
  return value;
}

export function useConsentSnapshot(): ConsentSnapshot {
  return useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentSnapshot);
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useConsentSnapshot();
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);

  const value = useMemo<ConsentUiContextValue>(
    () => ({
      isPreferencesOpen,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      snapshot,
    }),
    [isPreferencesOpen, snapshot],
  );

  return <ConsentUiContext.Provider value={value}>{children}</ConsentUiContext.Provider>;
}

