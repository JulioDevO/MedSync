import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import Pacientes from "./pages/Pacientes";
import Agenda from "./pages/Agenda";
import Prontuarios from "./pages/Prontuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/prontuarios" element={<Prontuarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
