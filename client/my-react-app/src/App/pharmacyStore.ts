import { create } from "zustand";

type TravelMode = "WALK" | "CAR";

type PharmacyRow = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  walkMinutes: number;
  queueLength: number;
  selected: boolean;
};

type Store = {
  data: PharmacyRow[];
  travelMode: TravelMode;

  setData: (data: PharmacyRow[]) => void;
  toggleSelect: (id: number) => void;
  setTravelMode: (mode: TravelMode) => void;
};

export const usePharmacyStore = create<Store>((set) => ({
  data: [],
  travelMode: "WALK",

  setData: (data) => set({ data }),

  toggleSelect: (id) =>
    set((state) => ({
      data: state.data.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      ),
    })),

  setTravelMode: (mode) => set({ travelMode: mode }),
}));