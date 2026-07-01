import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type LocationState = {
  city: string;
  street: string;
  lat?: number;
  lng?: number;
  manualConfirmed: boolean;
  locationReady: boolean;
};

const initialState: LocationState = {
  city: "",
  street: "",
  manualConfirmed: false,
  locationReady: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setStreet: (state, action: PayloadAction<string>) => {
      state.street = action.payload;
    },
    setManualConfirmed: (state, action: PayloadAction<boolean>) => {
    state.manualConfirmed = action.payload;
    },
    setLocationReady: (state, action: PayloadAction<boolean>) => {
  state.locationReady = action.payload;
},
  }});

export const { setCity, setStreet ,setManualConfirmed,setLocationReady} = locationSlice.actions;
export default locationSlice.reducer;