import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Agenda from "./pages/Agenda";
import Prontuarios from "./pages/Prontuarios";
import Usuarios from "./pages/Usuarios";

import ChatBot from "./components/ChatBot";

// ============================================================
// Estrutura de rotas
//
//   /login            → pública
//
//   ── Bloco 1: qualquer usuário autenticado ──────────────────
//   /dashboard         → recepcionista, médico, admin
//   /agenda            → recepcionista, médico, admin
//
//   ── Bloco 2: recepcionista + admin ─────────────────────────
//   /pacientes         → recepcionista, admin
//
//   ── Bloco 3: médico + admin ─────────────────────────────────
//   /prontuarios       → médico, admin
//
//   ── Bloco 4: somente admin ──────────────────────────────────
//   /usuarios          → admin
//
// Cada bloco é um <ProtectedRoute allowedRoles={[...]}> separado,
// porque allowedRoles é fixo por bloco — não dá pra misturar
// rotas com permissões diferentes sob o mesmo wrapper.
// ============================================================

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Bloco 1 — Acesso Geral (Recepcionista, Médico e Paciente) */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "medico", "paciente"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/prontuarios" element={<Prontuarios />} />
          </Route>

          {/* Bloco 2 — Gestão Clínica (Recepcionista e Médico) */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "medico"]} />}>
            <Route path="/pacientes" element={<Pacientes />} />
          </Route>

          {/* Bloco 3 — Administração (Exclusivo da Recepcionista / Admin) */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;