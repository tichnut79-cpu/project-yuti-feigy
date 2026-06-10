import { configureStore } from "@reduxjs/toolkit";
import medicineSearchReducer from "../components/MedicineSearch/MedicineSearchSlice";

export const store = configureStore({
  reducer: {
    medicineSearch: medicineSearchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;