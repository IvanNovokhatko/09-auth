import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CreateNotePayload } from '@/lib/api/clientApi';

export const initialDraft: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteDraftState {
  draft: CreateNotePayload;
  setDraft: (note: Partial<CreateNotePayload>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
