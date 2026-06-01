import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePersonalAuth } from "../context/PersonalAuthContext";

export default function PersonalLogin() {
  const { login } = usePersonalAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const sf = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await login(form.email, form.senha);
      navigate("/personal/dashboard");
    } catch (err) {
      setErro(err.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-bold text-2xl text-gray-900">VITAL<span className="text-[#ff6600]">FIT</span></span>
          <p className="text-gray-400 text-sm mt-2">Área do Personal Trainer</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Entrar como Personal</h1>

          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => sf("email", e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:border-[#ff6600] transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">Senha</label>
              <input
                type="password"
                value={form.senha}
                onChange={e => sf("senha", e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 focus:outline-none focus:border-[#ff6600] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Não tem conta?{" "}
            <Link to="/personal/register" className="text-[#ff6600] hover:underline font-medium">
              Cadastrar-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
