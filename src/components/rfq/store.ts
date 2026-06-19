import { create } from 'zustand';

export type RfqDraft = {
  projectType: string;
  buildingType: string;
  area_m2: string; // kept as string for controlled input
  systemPreference: string;
  location: string;
  deadline: string;
  technicalRequirements: string;
  projectStage: string;
  hasDrawings: string;
  needsMep: string;
  projectChallenge: string;
  contactName: string;
  company: string;
  phone: string;
};

const empty: RfqDraft = {
  projectType: '',
  buildingType: '',
  area_m2: '',
  systemPreference: 'auto',
  location: '',
  deadline: '',
  technicalRequirements: '',
  projectStage: '',
  hasDrawings: '',
  needsMep: '',
  projectChallenge: '',
  contactName: '',
  company: '',
  phone: '',
};

type RfqState = {
  step: number;
  draft: RfqDraft;
  setField: (key: keyof RfqDraft, value: string) => void;
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
