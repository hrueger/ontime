import { create } from 'zustand';

import { booleanFromLocalStorage, stringFromLocalStorage } from '../utils/localStorage';

type EventSettings = {
  showQuickEntry: boolean;
  startTimeIsLastEnd: boolean;
  defaultDepartment: string;
};

type LocalEventStore = {
  eventSettings: EventSettings;
  setLocalEventSettings: (newState: EventSettings) => void;
  setShowQuickEntry: (showQuickEntry: boolean) => void;
  setStartTimeIsLastEnd: (startTimeIsLastEnd: boolean) => void;
  setDefaultDepartment: (defaultDepartment: string) => void;
};

enum LocalEventKeys {
  ShowQuickEntry = 'ontime-show-quick-entry',
  StartTimeIsLastEnd = 'ontime-start-is-last-end',
  DefaultDepartment = 'ontime-default-department',
}

export const useLocalEvent = create<LocalEventStore>((set) => ({
  eventSettings: {
    showQuickEntry: booleanFromLocalStorage(LocalEventKeys.ShowQuickEntry, false),
    startTimeIsLastEnd: booleanFromLocalStorage(LocalEventKeys.StartTimeIsLastEnd, true),
    defaultDepartment: stringFromLocalStorage(LocalEventKeys.DefaultDepartment, ''),
  },

  setLocalEventSettings: (value) =>
    set(() => {
      localStorage.setItem(LocalEventKeys.ShowQuickEntry, String(value.showQuickEntry));
      localStorage.setItem(LocalEventKeys.StartTimeIsLastEnd, String(value.startTimeIsLastEnd));
      localStorage.setItem(LocalEventKeys.DefaultDepartment, String(value.defaultDepartment));
      return { eventSettings: value };
    }),

  setShowQuickEntry: (showQuickEntry) =>
    set((state) => {
      localStorage.setItem(LocalEventKeys.ShowQuickEntry, String(showQuickEntry));
      return { eventSettings: { ...state.eventSettings, showQuickEntry } };
    }),

  setStartTimeIsLastEnd: (startTimeIsLastEnd) =>
    set((state) => {
      localStorage.setItem(LocalEventKeys.StartTimeIsLastEnd, String(startTimeIsLastEnd));
      return { eventSettings: { ...state.eventSettings, startTimeIsLastEnd } };
    }),

  setDefaultDepartment: (defaultDepartment) =>
    set((state) => {
      localStorage.setItem(LocalEventKeys.DefaultDepartment, String(defaultDepartment));
      return { eventSettings: { ...state.eventSettings, defaultDepartment } };
    }),
}));
