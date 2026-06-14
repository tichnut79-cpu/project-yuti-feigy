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
  };

  return (
    <div className="medicine-page">
      <h1>בחר תרופה</h1>

      <input
        value={search}
        onChange={handleSearchChange}
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
            {
            search.trim()!=="" &&
            medicines.map((m: Medicine) => (
              <tr key={m.name} onClick={()=>setSearch(m.name)}>
                {/* <td>{m.id}</td> */}
                <td>{m.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="login-btn" onClick={() => navigate("/pharmsTable")}>
            enter
          </button>
    </div>
  );
}

export default MedicineSearch;