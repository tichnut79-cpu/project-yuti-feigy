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
};

type Store = {
  pharmacies: PharmacyRow[];
  selectedId: number | null;
  travelMode: TravelMode;

  setPharmacies: (data: PharmacyRow[]) => void;
  setSelectedId: (id: number | null) => void;
  setTravelMode: (mode: TravelMode) => void;
};

export const usePharmacyStore = create<Store>((set) => ({
  pharmacies: [],
  selectedId: null,
  travelMode: "WALK",

  setPharmacies: (data) => set({ pharmacies: data }),
  setSelectedId: (id) => set({ selectedId: id }),
  setTravelMode: (mode) => set({ travelMode: mode }),
}));