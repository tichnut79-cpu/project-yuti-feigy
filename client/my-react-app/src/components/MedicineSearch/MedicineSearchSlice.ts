import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL=import.meta.env.VITE_API_URL;
export interface Medicine {
  id: number;
  name: string;
}
console.log("API_URL =", API_URL);
/* 🔹 GET request לשרת */
export const fetchMedicines = createAsyncThunk<Medicine[]>(
  "medicineSearch/fetchMedicines",
  async () => {
    const res = await fetch(`${API_URL}/api/medicines`);
    if(!res.ok){
      throw new Error("Failed to fetch medicines");
    }
    return await res.json();
  }
);

export interface MedicineSearchState {
  medicines: Medicine[];
  search: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MedicineSearchState = {
  medicines: [],
  search: "",
  status: "idle",
  error: null,
};

const medicineSearchSlice = createSlice({
  name: "medicineSearch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.medicines = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "error";
      });
  },
});

export default medicineSearchSlice.reducer;