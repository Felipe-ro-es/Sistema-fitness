import { useEffect, useState } from "react";
import { Link } from "react-router";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function parseArr(v) {
  try { return v ? JSON.parse(v) : []; } catch { return []; }
}

function formatArr(v) {
  const arr = parseArr(v);
  if (arr.length > 0) return arr.map(s => s.replace(/_/g, " ")).join(", ");
  return typeof v === "string" ? v.replace(/_/g, " ") : "—";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    api.get("/usuario/perfil-fisico").then(setPerfil).catch(() => setPerfil(null));
    api.get("/progresso").then(data => setHistorico(Array.isArray(data) ? data : [])).catch(() => setHistorico([]));
  }, []);

  const cards = [
    {
      label: "Peso atual",
      value: historico.length > 0 ? `${historico[0].peso} kg` : perfil?.peso ? `${perfil.peso} kg` : "—",
      icon: "⚖",
      color: "text-[#ff6600]",
    },
    {
      label: "Objetivo",
      value: perfil?.objetivo ? formatArr(perfil.objetivo) : "—",
      icon: "◎",
      color: "text-blue-400",
    },
    {
      label: "Nível de atividade",
      value: perfil?.nivel_atv_fisica ?? "—",
      icon: "◈",
      color: "text-purple-400",
    },
    {
      label: "Registros de progresso",
      value: historico.length > 0 ? historico.length : "0",
      icon: "◷",
      color: "text-yellow-400",
    },
  ];

  const quickLinks = [
    { to: "/questionario", label: "Atualizar perfil físico", icon: "◎", desc: "Edite seus dados para refinar os planos" },
    { to: "/plano-treino", label: "Ver plano de treino", icon: "◈", desc: "Seu programa semanal personalizado" },
    { to: "/historico", label: "Registrar progresso", icon: "◷", desc: "Adicione peso e medidas de hoje" },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.nome?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">Aqui está um resumo da sua jornada fitness.</p>
      </div>

      {!perfil && (
        <div className="mb-8 p-4 rounded-xl bg-[#ff6600]/10 border border-[#ff6600]/30 flex items-center justify-between gap-4">
          <div>
            <p className="text-[#ff6600] font-medium">Complete seu perfil físico</p>
            <p className="text-gray-400 text-sm mt-0.5">
              Preencha o questionário para que seu plano de treino seja gerado.
            </p>
          </div>
          <Link
            to="/questionario"
            className="shrink-0 bg-[#ff6600] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e55a00] transition-colors"
          >
            Preencher agora
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`text-xl mb-3 ${color}`}>{icon}</div>
            <p className="text-gray-400 text-xs">{label}</p>
            <p className="text-gray-900 font-bold text-lg mt-0.5 truncate">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso rápido</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {quickLinks.map(({ to, label, icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#ff6600]/40 transition-colors flex gap-4 items-start"
          >
            <span className="text-[#ff6600] text-xl mt-0.5">{icon}</span>
            <div>
              <p className="text-gray-900 font-medium">{label}</p>
              <p className="text-gray-400 text-sm mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
