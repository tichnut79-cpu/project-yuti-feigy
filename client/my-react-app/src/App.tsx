import { useState } from "react";
import PharmaciesTable from "./components/pharmsTable/PharmsTable";

type Medicine = {
  id: string;
  name: string;
};

function App() {
  const [selectedCity, setSelectedCity] = useState("Tel Aviv");
   const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  console.log("selectedCity =", selectedCity);
  return (
    <div>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="Tel Aviv">Tel Aviv</option>
        <option value="Haifa">Haifa</option>
        <option value="Jerusalem">Jerusalem</option>
        <option value="Ashdod">Ashdod</option>
      </select>

      <PharmaciesTable
        city={selectedCity}
        userLat={32.0853}
        userLng={34.7818}
        medicines={selectedMedicines}
      />
    </div>
  );
}

export default App;