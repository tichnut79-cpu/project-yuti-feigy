import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type LocationState = {
  city: string;
  street: string;
  lat?: number;
  lng?: number;
};

const initialState: LocationState = {
  city: "",
  street: ""
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
    }
  }
});

export const { setCity, setStreet } = locationSlice.actions;
export default locationSlice.reducer;