import { BrowserRouter, Routes } from "react-router";
import Landing from "../pages/Landing";
import { Route } from "react-router";
import Register from "../pages/Register";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}