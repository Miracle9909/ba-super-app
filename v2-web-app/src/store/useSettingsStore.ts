import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  anthropicApiKey: string;
  setAnthropicApiKey: (key: string) => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      anthropicApiKey: '',
      setAnthropicApiKey: (key) => set({ anthropicApiKey: key }),
      clearSettings: () => set({ anthropicApiKey: '' }),
    }),
    {
      name: 'ba-super-app-settings', // name of the item in the storage (must be unique)
    }
  )
);
