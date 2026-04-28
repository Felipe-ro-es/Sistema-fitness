import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";
import { Link } from "react-router";

export default function PlanoTreino() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);

  const MOCK_PLANO = {
    objetivo: "ganho_de_massa",
    descricao: `Segunda-feira — Peito e Tríceps
- Supino reto com barra: 4x8-10
- Supino inclinado com halteres: 3x10-12
- Crossover no cabo: 3x12-15
- Tríceps corda: 4x12
- Tríceps testa: 3x10

Terça-feira — Costas e Bíceps
- Puxada frontal: 4x10
- Remada curvada: 4x8-10
- Remada unilateral: 3x10
- Rosca direta: 3x10-12
- Rosca martelo: 3x12

Quarta-feira — Descanso ativo
- Caminhada 30 min ou alongamento

Quinta-feira — Ombros e Abdômen
- Desenvolvimento com barra: 4x8-10
- Elevação lateral: 3x12-15
- Elevação frontal: 3x12
- Abdominal crunch: 4x20
- Prancha: 3x45s

Sexta-feira — Pernas
- Agachamento livre: 4x8-10
- Leg press: 4x10-12
- Cadeira extensora: 3x12-15
- Cadeira flexora: 3x12-15
- Panturrilha em pé: 4x15

Sábado — Treino metabólico
- Circuito HIIT 20 min
- Burpees, polichinelos, agachamento com salto

Domingo — Descanso completo`,
  };

  useEffect(() => {
    api.get("/plano-treino")
      .then(setPlano)
      .catch(() => setPlano(MOCK_PLANO))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!plano) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="text-5xl mb-4">◈</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plano de treino não gerado ainda</h2>
          <p className="text-gray-400 mb-6">
            Complete seu perfil físico para criar seu plano de treino personalizado.
          </p>
          <Link
            to="/questionario"
            className="bg-[#ff6600] px-6 py-3 rounded-lg font-semibold hover:bg-[#e55a00] transition-colors"
          >
            Preencher perfil físico
          </Link>
        </div>
      </AppLayout>
    );
  }

  const dias = plano.descricao
    ? parsePlano(plano.descricao)
    : [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano de Treino</h1>
            <p className="text-gray-400 mt-1">
              Objetivo:{" "}
              <span className="text-[#ff6600] font-medium capitalize">
                {plano.objetivo?.replace(/_/g, " ")}
              </span>
            </p>
          </div>

        </div>

        {dias.length > 0 ? (
          <div className="space-y-4">
            {dias.map((dia, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[#ff6600] font-semibold mb-3">{dia.titulo}</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{dia.conteudo}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{plano.descricao}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function parsePlano(texto) {
  if (!texto) return [];
  const blocos = texto.split(/\n(?=(?:Segunda|Ter.a|Quarta|Quinta|Sexta|S.bado|Domingo|Dia \d))/i);
  if (blocos.length <= 1) return [];
  return blocos.map((bloco) => {
    const linhas = bloco.trim().split("\n");
    return { titulo: linhas[0], conteudo: linhas.slice(1).join("\n").trim() };
  });
}
