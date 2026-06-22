import { useState } from "react";
import PharmaciesTable from "./components/pharmsTable/PharmsTable";

function App() {
  const [selectedCity, setSelectedCity] = useState("Tel Aviv");

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
      />
    </div>
  );
}

export default App;