import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";
import { Link } from "react-router";

export default function PlanoAlimentar() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);

  const MOCK_PLANO = {
    calorias: 2800,
    descricao: `Cafe da manha — 7h00
- 3 ovos mexidos com azeite
- 2 fatias de pão integral
- 1 banana
- 1 copo de leite desnatado (200ml)
- Café sem açúcar

Lanche da manha — 10h00
- 1 iogurte grego natural (170g)
- 1 punhado de castanhas (30g)
- 1 fruta (maçã ou pera)

Almoco — 13h00
- 180g de frango grelhado
- 4 colheres de arroz integral
- 1 concha de feijão
- Salada verde à vontade com azeite
- 1 fruta

Lanche pre-treino — 16h00
- 2 torradas integrais com pasta de amendoim
- 1 banana

Jantar — 20h00
- 180g de peixe grelhado (tilápia ou salmão)
- 3 batatas-doce médias assadas
- Legumes refogados (brócolis, cenoura)
- Salada de folhas

Ceia — 22h00
- 200g de cottage ou ricota
- 1 colher de mel`,
  };

  useEffect(() => {
    api.get("/plano-alimentar")
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
          <div className="text-5xl mb-4">◉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plano alimentar não gerado ainda</h2>
          <p className="text-gray-400 mb-6">
            Complete seu perfil físico para criar seu plano alimentar personalizado.
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

  const refeicoes = parsePlano(plano.descricao);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano Alimentar</h1>
            {plano.calorias && (
              <p className="text-gray-400 mt-1">
                Meta calórica:{" "}
                <span className="text-[#ff6600] font-medium">{plano.calorias} kcal/dia</span>
              </p>
            )}
          </div>
        
        </div>

        {refeicoes.length > 0 ? (
          <div className="space-y-4">
            {refeicoes.map((refeicao, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[#ff6600] font-semibold mb-3">{refeicao.titulo}</h3>
                <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{refeicao.conteudo}</p>
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
  const blocos = texto.split(/\n(?=(?:Caf.|Almo.o|Lanche|Jantar|Ceia|Refei..o \d))/i);
  if (blocos.length <= 1) return [];
  return blocos.map((bloco) => {
    const linhas = bloco.trim().split("\n");
    return { titulo: linhas[0], conteudo: linhas.slice(1).join("\n").trim() };
  });
}
