import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../src/App/store";

import LoginWithGoogle from "./components/Login/Login";
import MedicineSearch from "./components/MedicineSearch/MedicineSearch";
import PharmaciesTable from "./components/PharmsTable/PharmsTable";
import ProtectedRoute from "./components/ProtectedRouter/ProtectedRouter";

function App() {
  const location = useSelector((state: RootState) => state.location);
  const selectedMedicines = useSelector(
    (state: RootState) => state.selectedMedicines.items
  );

  const isLocationValid =
    location.city.trim() !== "" && location.street.trim() !== "";

  const canEnterSearch =
    isLocationValid && selectedMedicines.length > 0;

  return (
    <Routes>
      <Route
        path="/pharmsTable"
        element={
          <ProtectedRoute condition={canEnterSearch}>
            <PharmaciesTable
              // city="Tel Aviv"
              userLat={32.0853}
              userLng={34.7818}
            />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<LoginWithGoogle />} />

      <Route
        path="/search"
        element={
          <ProtectedRoute condition={isLocationValid}>
            <MedicineSearch />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;