
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SchoolInfo = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  principalName: string;
};

type SchoolInfoStore = {
  schoolInfo: SchoolInfo | null;
  updateSchoolInfo: (info: SchoolInfo) => void;
};

export const useSchoolInfoStore = create<SchoolInfoStore>()(
  persist(
    (set) => ({
      schoolInfo: null,
      updateSchoolInfo: (info) => set({ schoolInfo: info }),
    }),
    {
      name: "school-info-storage",
    }
  )
);
