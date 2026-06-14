import { Routes, Route } from "react-router-dom";
import LoginWithGoogle from './components/Login/Login'
import MedicineSearch from './components/MedicineSearch/MedicineSearch'
import './App.css'
import PharmaciesTable from "./components/PharmsTable/PharmsTable"



function App() {
  return (
    // <PharmaciesTable
    //   city="Tel Aviv"
    //   userLat={32.0853}
    //   userLng={34.7818}
    // />
    <Routes>
       <Route path="/" element={<LoginWithGoogle></LoginWithGoogle>}></Route>
       <Route path="/search" element={<MedicineSearch></MedicineSearch>}></Route>
       <Route path="/pharmsTable" element={
        <PharmaciesTable
      city="Tel Aviv"
      userLat={32.0853}
      userLng={34.7818}
    />}>
       </Route>
     </Routes>

  );
}

export default App;
