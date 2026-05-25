import React, { useEffect, useState } from "react";
import "../MedicineSearch/MedicineSearch.css";

type Medicine = {
  id: number;
  name: string;
};

const MedicineSearch: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // טעינת נתונים מהשרת
  useEffect(() => {
    fetch("http://localhost:5173/ApiPharm/medicines")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setMedicines(data);
      });
  }, []);

  // סינון לפי חיפוש
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    console.log("Selected medicine:", search);
  };

  return (
    <div className="medicine-page">
      <div className="medicine-card">
        <h1>בחר תרופה</h1>

        <input
          type="text"
          placeholder="הקלד שם תרופה..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="medicine-input"
        />

        {search && (
          <ul className="medicine-list">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <li
                  key={medicine.id}
                  onClick={() => setSearch(medicine.name)}
                  className="medicine-item"
                >
                  {medicine.name}
                </li>
              ))
            ) : (
              <li className="no-result">לא נמצאו תוצאות</li>
            )}
          </ul>
        )}

        <button className="enter-button" onClick={handleSubmit}>
          ENTER
        </button>
      </div>
    </div>
  );
};

export default MedicineSearch;