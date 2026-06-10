import { Routes, Route } from "react-router-dom";
import LoginWithGoogle from './components/Login/Login'
import MedicineSearch from './components/MedicineSearch/MedicineSearch'
import './App.css'



function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginWithGoogle></LoginWithGoogle>}></Route>
      <Route path="/search" element={<MedicineSearch></MedicineSearch>}></Route>
    </Routes>

  );
}

export default App;
