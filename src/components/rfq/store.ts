import { create } from 'zustand';

export type RfqDraft = {
  // Step 1 — Project identity
  projectType: string;
  buildingType: string; // building use
  projectCountry: string;
  projectCity: string;
  projectName: string;
  // Step 2 — Ceiling system
  systemPreference: string; // ceiling system (slug, 'auto' = not sure, or '')
  applicationZone: string;
  // Step 3 — Technical parameters
  area_m2: string; // kept as string for controlled input
  areaUnknown: boolean;
  ceilingHeight: string;
  projectStage: string;
  deadline: string; // timeline
  acousticRequirement: string;
  fireRequirement: string;
  finishRequirement: string;
  supplyScope: string; // supply only vs supply + installation
  notes: string;
  // Step 4 — Buyer identity & submission
  contactName: string;
  company: string;
  buyerRole: string;
  phone: string; // phone or WhatsApp
  email: string;
  preferredContact: string;
  preferredLanguage: string;
  consent: boolean;
  /** Honeypot — must stay empty; bots that fill it are silently rejected. */
  website: string;
};

const empty: RfqDraft = {
  projectType: '',
  buildingType: '',
  projectCountry: '',
  projectCity: '',
  projectName: '',
  systemPreference: '',
  applicationZone: '',
  area_m2: '',
  areaUnknown: false,
  ceilingHeight: '',
  projectStage: '',
  deadline: '',
  acousticRequirement: '',
  fireRequirement: '',
  finishRequirement: '',
  supplyScope: '',
  notes: '',
  contactName: '',
  company: '',
  buyerRole: '',
  phone: '',
  email: '',
  preferredContact: '',
  preferredLanguage: '',
  consent: false,
  website: '',
};

type RfqState = {
  step: number;
  draft: RfqDraft;
  setField: <K extends keyof RfqDraft>(key: K, value: RfqDraft[K]) => void;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
};

export const useRfqStore = create<RfqState>((set) => ({
  step: 0,
  draft: { ...empty },
  setField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value } })),
  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  reset: () => set({ step: 0, draft: { ...empty } }),
}));
