import { create } from "zustand";

interface ReportState {
  report: any[];
  filter: string;
  setFilter: (filter: "today" | "week" | "month") => void;
  setReport: (report: any[]) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  report: [],
  filter: "week",
  setReport: (report) => set({ report }),
  setFilter: (filter) => set({ filter }),
}));
