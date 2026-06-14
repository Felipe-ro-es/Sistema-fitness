import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { personalApi } from "../services/api";
import { usePersonalAuth } from "../context/PersonalAuthContext";

export default function PersonalDashboard() {
  const { personal, logout } = usePersonalAuth();
  const navigate = useNavigate();
  const [pendentes, setPendentes] = useState([]);
  const [validados, setValidados] = useState([]);
  const [aba, setAba] = useState("pendentes");
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const [p, v] = await Promise.all([
        personalApi.get("/personal/planos/pendentes"),
        personalApi.get("/personal/planos/validados"),
      ]);
      setPendentes(Array.isArray(p) ? p : []);
      setValidados(Array.isArray(v) ? v : []);
    } catch {
      setPendentes([]);
      setValidados([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/personal/login");
  }

  const lista = aba === "pendentes" ? pendentes : validados;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-gray-900">VITAL<span className="text-[#ff6600]">FIT</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500 font-medium">Painel Personal Trainer</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{personal?.nome}</p>
            <p className="text-xs text-gray-400">CREF {personal?.cref}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-400 text-xs mb-1">Planos pendentes</p>
            <p className="text-3xl font-bold text-[#ff6600]">{pendentes.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-400 text-xs mb-1">Planos validados</p>
            <p className="text-3xl font-bold text-green-500">{validados.length}</p>
          </div>
          <Link to="/personal/usuarios" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#ff6600]/40 transition-colors">
            <p className="text-gray-400 text-xs mb-1">Meus alunos</p>
            <p className="text-3xl font-bold text-blue-500">Ver todos →</p>
          </Link>
        </div>

        {/* Abas */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-lg w-fit">
          <button
            onClick={() => setAba("pendentes")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${aba === "pendentes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pendentes {pendentes.length > 0 && <span className="ml-1.5 bg-[#ff6600] text-white text-xs px-1.5 py-0.5 rounded-full">{pendentes.length}</span>}
          </button>
          <button
            onClick={() => setAba("validados")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${aba === "validados" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Validados
          </button>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : lista.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">
              {aba === "pendentes" ? "Nenhum plano aguardando validação." : "Nenhum plano validado ainda."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lista.map(plano => {
              const usuario = plano.Perfilfisico?.Usuario;
              const objetivo = (() => {
                try {
                  const arr = plano.objetivo ? JSON.parse(plano.objetivo) : [];
                  if (arr.length > 0) return arr.map(s => s.replace(/_/g, " ")).join(", ");
                } catch {}
                return plano.objetivo?.replace(/_/g, " ") ?? null;
              })();
              return (
                <Link
                  key={plano.id}
                  to={`/personal/plano/${plano.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#ff6600]/40 transition-colors block"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#ff6600]/10 flex items-center justify-center font-bold text-[#ff6600] shrink-0">
                      {usuario?.nome?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{usuario?.nome ?? "Usuário"}</p>
                      <p className="text-xs text-gray-400 truncate">{usuario?.email}</p>
                      {objetivo && (
                        <p className="text-xs text-gray-500 mt-0.5 break-words">{objetivo}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(plano.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      plano.status === "pendente" ? "bg-yellow-100 text-yellow-700"
                      : plano.status === "revisao" ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                    }`}>
                      {plano.status === "pendente" ? "Pendente" : plano.status === "revisao" ? "Em revisão" : "Validado"}
                    </span>
                    <span className="text-gray-300 text-sm">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
