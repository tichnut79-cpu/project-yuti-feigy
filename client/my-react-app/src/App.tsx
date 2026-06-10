import { Routes, Route } from "react-router-dom";
import LoginWithGoogle from './components/Login/Login'
import MedicineSearch from './components/MedicineSearch/MedicineSearch'
import './App.css'



function App() {
  return (
    <Routes>

    {/* <h1>hello feigy!!!!!!!!!!!!!!!!!!!!</h1> */}
    <Route path="/" element={<LoginWithGoogle/>}></Route>
    <Route path="/search" element={<MedicineSearch/>}></Route>

</Routes>

  );
}

export default App;
