import { configureStore } from "@reduxjs/toolkit";
import medicineSearchReducer from "../components/MedicineSearch/MedicineSearchSlice";
import selectedMedicinesReducer from "../components/MedicineSearch/selectedMedicinesSlice"
export const store = configureStore({
  reducer: {
    medicineSearch: medicineSearchReducer,
    selectedMedicines: selectedMedicinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;