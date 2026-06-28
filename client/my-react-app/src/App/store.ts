import { configureStore } from "@reduxjs/toolkit";

import medicineSearchReducer from "../components/MedicineSearch/MedicineSearchSlice";
import selectedMedicinesReducer from "../components/MedicineSearch/selectedMedicinesSlice"
import locationReducer from "../Slices/locationSlice";
import authReducer from "../Slices/authSlice";

export const store = configureStore({
  reducer: {
    medicineSearch: medicineSearchReducer,
    selectedMedicines: selectedMedicinesReducer,
    location: locationReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;