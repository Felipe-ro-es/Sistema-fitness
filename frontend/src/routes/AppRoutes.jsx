import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Questionario from "../pages/Questionario";
import PlanoTreino from "../pages/PlanoTreino";
import Historico from "../pages/Historico";
import ProtectedRoute from "../components/ProtectedRoute";
import PersonalLogin from "../pages/PersonalLogin";
import PersonalRegister from "../pages/PersonalRegister";
import PersonalDashboard from "../pages/PersonalDashboard";
import PersonalPlanDetail from "../pages/PersonalPlanDetail";
import PersonalUsuarios from "../pages/PersonalUsuarios";
import PersonalProtectedRoute from "../components/PersonalProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/questionario"
          element={<ProtectedRoute><Questionario /></ProtectedRoute>}
        />
        <Route
          path="/plano-treino"
          element={<ProtectedRoute><PlanoTreino /></ProtectedRoute>}
        />
        <Route
          path="/historico"
          element={<ProtectedRoute><Historico /></ProtectedRoute>}
        />

        {/* Área do Personal Trainer */}
        <Route path="/personal/login" element={<PersonalLogin />} />
        <Route path="/personal/register" element={<PersonalRegister />} />
        <Route
          path="/personal/dashboard"
          element={<PersonalProtectedRoute><PersonalDashboard /></PersonalProtectedRoute>}
        />
        <Route
          path="/personal/plano/:id"
          element={<PersonalProtectedRoute><PersonalPlanDetail /></PersonalProtectedRoute>}
        />
        <Route
          path="/personal/usuarios"
          element={<PersonalProtectedRoute><PersonalUsuarios /></PersonalProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}