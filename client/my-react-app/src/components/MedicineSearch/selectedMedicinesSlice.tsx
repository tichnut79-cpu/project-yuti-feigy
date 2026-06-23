import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SelectedMedicinesState {
  items: string[];
}

const initialState: SelectedMedicinesState = {
  items: [],
};

const selectedMedicinesSlice = createSlice({
  name: "selectedMedicines",
  initialState,
  reducers: {
    addMedicine: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
      }
    },

    removeMedicine: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((m) => m !== action.payload);
    },

    clearMedicines: (state) => {
      state.items = [];
    },
  },
});

export const {
  addMedicine,
  removeMedicine,
  clearMedicines,
} = selectedMedicinesSlice.actions;

export default selectedMedicinesSlice.reducer;