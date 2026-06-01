import { createContext, useContext, useState, useEffect } from "react";
import { personalApi } from "../services/api";

const PersonalAuthContext = createContext(null);

export function PersonalAuthProvider({ children }) {
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("personal");
    if (stored) setPersonal(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(email, senha) {
    const data = await personalApi.post("/auth/personal/login", { email, senha });
    localStorage.setItem("personal_token", data.token);
    localStorage.setItem("personal", JSON.stringify(data.personal));
    setPersonal(data.personal);
    return data;
  }

  async function register(nome, email, senha, cref) {
    const data = await personalApi.post("/auth/personal/register", { nome, email, senha, cref });
    localStorage.setItem("personal_token", data.token);
    localStorage.setItem("personal", JSON.stringify(data.personal));
    setPersonal(data.personal);
    return data;
  }

  function logout() {
    localStorage.removeItem("personal_token");
    localStorage.removeItem("personal");
    setPersonal(null);
  }

  return (
    <PersonalAuthContext.Provider value={{ personal, loading, login, register, logout }}>
      {children}
    </PersonalAuthContext.Provider>
  );
}

export function usePersonalAuth() {
  return useContext(PersonalAuthContext);
}
