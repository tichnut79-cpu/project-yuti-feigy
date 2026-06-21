import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMedicines,clearMedicines } from "./MedicineSearchSlice";
import type { RootState, AppDispatch } from "../../App/store";

import "./MedicineSearch.css";

type Medicine = {
  id?: number;
  name: string;
};

function MedicineSearch() {
  const dispatch = useDispatch<AppDispatch>();
const navigate = useNavigate();
const medicines = useSelector(
    (state: RootState) => state.medicineSearch.medicines
  ) as Medicine[];

  const [search, setSearch] = useState<string>("");
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if(search.trim()===""){
      dispatch(clearMedicines());
      return;
    }
    const timeout=setTimeout(()=>{
      dispatch(fetchMedicines(search));
    },100);
    return()=>clearTimeout(timeout);
  }, [search,dispatch]);

  // const filteredMedicines = medicines.filter((medicine: Medicine) =>
  //   medicine.name.toLowerCase().includes(search.toLowerCase())
  // );
const addMedicine = (name: string) => {
  setSelectedMedicines((prev) =>
    prev.includes(name) ? prev : [...prev, name]
  );
};
const removeMedicine = (name: string) => {
  setSelectedMedicines((prev) =>
    prev.filter((m) => m !== name)
  );
};
  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
  };
  const isValidMedicine = selectedMedicines?.length > 0;


  return (
    <div className="medicine-page">
      {selectedMedicines.length > 0 && (
  <div className="selected-box">

    <div className="selected-title">
      נבחרו {selectedMedicines.length} תרופות
    </div>

    {selectedMedicines.map((m) => (
      <div
        key={m}
        className="selected-item">
        
        {m}
        <span className="remove-x"
        onClick={() => removeMedicine(m)}
    >
      X
    </span>
      </div>
    ))}

  </div>
)}
      <h1>בחר תרופה</h1>

      <input
        value={search}
        onChange={handleSearchChange}
        placeholder="חפש תרופה..."
        className={error ? "input-error" : ""}
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
            {
            search.trim()!=="" &&
            medicines.map((m: Medicine) => (
              <tr key={m.name}
                onClick={() => addMedicine(m.name)}>
                <td>{m.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={`login-btn ${error ? "error-shake" : ""}`}
      // disabled={!isValidMedicine}
      onClick={() =>{
        if(!isValidMedicine){
          setError(true);

          setTimeout(()=>setError(false),600);
          return;
        }
        navigate("/pharmsTable", {
  state: { medicines: selectedMedicines }
})}}>
            🔎Find Pharmacies
          </button>
    </div>
  );
}

export default MedicineSearch;