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
  const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
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

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
    setSelectedMedicine(null);
  };
  const finalMedicine =
    selectedMedicine ??
    medicines.find(
      (m) => m.name.toLowerCase() === search.toLowerCase()
    )?.name;

  const isValidMedicine =Boolean(finalMedicine);


  return (
    <div className="medicine-page">
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
                onClick={()=>{
                setSearch(m.name); setSelectedMedicine(m.name)}}>
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
        navigate("/pharmsTable",{
      state: { medicine: finalMedicine}})}}>
            🔎Find Pharmacies
          </button>
    </div>
  );
}

export default MedicineSearch;