
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      // dados fictícios para visualizar o frontend sem backend
      setUser({ id: 1, nome: "Felipe Teste", email: "felipe@email.com" });
    }
    setLoading(false);
  }, []);

  async function login(email, senha) {
    const data = await api.post("/auth/login", { email, senha });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data;
  }

  async function register(nome, email, senha) {
    const data = await api.post("/auth/register", { nome, email, senha });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
