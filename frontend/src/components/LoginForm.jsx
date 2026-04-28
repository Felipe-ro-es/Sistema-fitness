import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.senha);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg border border-gray-200"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-gray-900">
            VITAL<span className="text-[#ff6600]">FIT</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Entrar na sua conta</h2>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo de volta!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-gray-600 text-sm mb-1.5">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label htmlFor="senha" className="text-gray-600 text-sm mb-1.5">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Sua senha"
            required
            className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-[#ff6600] hover:text-[#d4f095] font-medium">
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}