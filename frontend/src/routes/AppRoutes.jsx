import { BrowserRouter, Routes, Route } from "react-router";
import Landing from "../pages/Landing";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Questionario from "../pages/Questionario";
import PlanoTreino from "../pages/PlanoTreino";
import PlanoAlimentar from "../pages/PlanoAlimentar";
import Historico from "../pages/Historico";
import ProtectedRoute from "../components/ProtectedRoute";

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
          path="/plano-alimentar"
          element={<ProtectedRoute><PlanoAlimentar /></ProtectedRoute>}
        />
        <Route
          path="/historico"
          element={<ProtectedRoute><Historico /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}