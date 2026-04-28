import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.senha !== form.confirmar) {
      setError("As senhas não coincidem.");
      return;
    }
    if (form.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await register(form.nome, form.email, form.senha);
      navigate("/questionario");
    } catch (err) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg border border-gray-200"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-xl font-bold text-gray-900">
            VITAL<span className="text-[#ff6600]">FIT</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Criar sua conta</h2>
          <p className="text-gray-400 text-sm mt-1">Comece sua jornada fitness hoje</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col mb-4">
          <label htmlFor="nome" className="text-gray-600 text-sm mb-1.5">Nome completo</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            required
            className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
          />
        </div>

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

        <div className="flex flex-col mb-4">
          <label htmlFor="senha" className="text-gray-600 text-sm mb-1.5">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
            className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label htmlFor="confirmar" className="text-gray-600 text-sm mb-1.5">Confirmar senha</label>
          <input
            type="password"
            id="confirmar"
            name="confirmar"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="Repita a senha"
            required
            className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#ff6600] hover:text-[#d4f095] font-medium">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}