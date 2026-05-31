import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicines } from "./MedicineSearchSlice";
import "./MedicineSearch.css";

export default function MedicineSearch() {
  const dispatch = useDispatch<any>();

  const medicines = useSelector(
    (state: any) => state.medicineSearch.medicines
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchMedicines());
  }, [dispatch]);

  const filteredMedicines = medicines.filter((medicine: any) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="medicine-page">
      <h1>בחר תרופה</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="חפש תרופה..."
      />

      <div className="medicinesTable">
        <h2>Medicines</h2>

        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>NAME</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.map((m: any) => (
              <tr key={m.name}>
                {/* <td>{m.id}</td> */}
                <td>{m.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}