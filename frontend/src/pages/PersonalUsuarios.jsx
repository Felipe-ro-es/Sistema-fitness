import { useEffect, useState } from "react";
import { Link } from "react-router";
import { personalApi } from "../services/api";
import { usePersonalAuth } from "../context/PersonalAuthContext";

const SECOES = [
  {
    titulo: "Objetivo",
    campos: [
      { label: "Objetivo principal", key: "objetivo", fmt: v => v?.replace(/_/g, " ") },
      { label: "Prazo", key: "prazo_objetivo" },
      { label: "Resultado esperado", key: "resultado_satisfatorio" },
      { label: "Tentou antes?", key: "tentou_antes" },
    ],
  },
  {
    titulo: "Dados físicos",
    campos: [
      { label: "Idade", key: "idade", fmt: v => v ? `${v} anos` : null },
      { label: "Sexo", key: "sexo" },
      { label: "Altura", key: "altura", fmt: v => v ? `${v} cm` : null },
      { label: "Peso atual", key: "peso", fmt: v => v ? `${v} kg` : null },
      { label: "Peso desejado", key: "peso_desejado", fmt: v => v ? `${v} kg` : null },
      { label: "% Gordura", key: "percentual_gordura", fmt: v => v ? `${v}%` : null },
      { label: "Medidas corporais", key: "medidas_corporais" },
    ],
  },
  {
    titulo: "Experiência",
    campos: [
      { label: "Nível musculação", key: "nivel_musculacao" },
      { label: "Tempo treinando", key: "tempo_treino" },
      { label: "Seguiu dieta antes?", key: "seguiu_dieta" },
      { label: "Executa básicos?", key: "sabe_executar_basicos" },
    ],
  },
  {
    titulo: "Rotina e disponibilidade",
    campos: [
      { label: "Dias disponíveis", key: "dias_disponiveis", fmt: v => parseArr(v).join(", ") },
      { label: "Tempo por treino", key: "tempo_por_treino" },
      { label: "Período preferido", key: "periodo_treino" },
      { label: "Nível de atividade", key: "nivel_atv_fisica" },
      { label: "Postura no trabalho", key: "trabalho_postura" },
    ],
  },
  {
    titulo: "Estrutura",
    campos: [
      { label: "Local de treino", key: "local_treino" },
      { label: "Equipamentos", key: "equipamentos" },
      { label: "Academia completa?", key: "academia_completa" },
      { label: "Preferência de treino", key: "preferencia_treino", fmt: v => parseArr(v).join(", ") },
      { label: "Modalidades", key: "modalidades", fmt: v => parseArr(v).join(", ") },
    ],
  },
  {
    titulo: "Saúde e restrições",
    campos: [
      { label: "Possui lesão?", key: "tem_lesao" },
      { label: "Dores frequentes?", key: "dores_frequentes" },
      { label: "Limitação física?", key: "limitacao_fisica" },
      { label: "Desconforto em exercício?", key: "exercicio_desconforto" },
      { label: "Acompanhamento médico?", key: "acompanhamento_medico" },
      { label: "Usa medicamentos?", key: "usa_medicamentos" },
      { label: "Horas de sono", key: "horas_sono", fmt: v => v ? `${v}h` : null },
      { label: "Nível de estresse", key: "nivel_estresse" },
      { label: "Água por dia", key: "agua_dia" },
      { label: "Consome álcool?", key: "consome_alcool" },
      { label: "Fuma?", key: "fuma" },
      { label: "Faz cardio?", key: "faz_cardio" },
      { label: "Observações", key: "obervacoes" },
    ],
  },
  {
    titulo: "Preferências de treino",
    campos: [
      { label: "Duração preferida", key: "preferencia_duracao_treino" },
      { label: "Gosta de cardio?", key: "gosta_cardio" },
      { label: "Tipo de treino", key: "treino_dividido" },
      { label: "Exercícios favoritos", key: "exercicios_favoritos" },
      { label: "Exercícios que odeia", key: "exercicios_odeia" },
    ],
  },
];

function parseArr(v) {
  try { return v ? JSON.parse(v) : []; } catch { return []; }
}

function flatten(perfil) {
  const strip = obj => {
    if (!obj) return {};
    const { id, perfilId, createdAt, updatedAt, ...rest } = obj?.dataValues ?? obj;
    return rest;
  };
  return {
    ...strip(perfil.DadosFisico),
    ...strip(perfil.PreferenciasTreino),
    ...strip(perfil.SaudeRestricao),
  };
}

function Campo({ label, valor }) {
  if (!valor && valor !== 0) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 shrink-0 w-44">{label}:</span>
      <span className="text-gray-800 font-medium capitalize">{String(valor)}</span>
    </div>
  );
}

export default function PersonalUsuarios() {
  const { personal } = usePersonalAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aberto, setAberto] = useState(null);

  useEffect(() => {
    personalApi.get("/personal/usuarios")
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-gray-900">VITAL<span className="text-[#ff6600]">FIT</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500 font-medium">Usuários do Sistema</span>
        </div>
        <Link to="/personal/dashboard" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← Voltar ao painel
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Todos os usuários <span className="text-gray-400 font-normal text-base">({usuarios.length})</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : usuarios.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">Nenhum usuário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {usuarios.map(perfil => {
              const usuario = perfil.Usuario;
              const dados = flatten(perfil);
              const isAberto = aberto === perfil.id;
              const meuAluno = perfil.personalId === personal?.id;

              return (
                <div key={perfil.id} className={`bg-white rounded-xl overflow-hidden border ${meuAluno ? "border-[#ff6600]/30" : "border-gray-200"}`}>
                  {/* Cabeçalho do card */}
                  <button
                    onClick={() => setAberto(isAberto ? null : perfil.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${meuAluno ? "bg-[#ff6600] text-white" : "bg-[#ff6600]/10 text-[#ff6600]"}`}>
                        {usuario?.nome?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{usuario?.nome ?? "—"}</p>
                        <p className="text-xs text-gray-400">{usuario?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {dados.objetivo && (
                        <span className="text-xs bg-orange-50 border border-orange-100 text-[#ff6600] px-2.5 py-1 rounded-full font-medium capitalize">
                          {dados.objetivo.replace(/_/g, " ")}
                        </span>
                      )}
                      {dados.peso && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                          {dados.peso} kg
                        </span>
                      )}
                      <span className="text-gray-400 text-sm">{isAberto ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {/* Respostas expandidas */}
                  {isAberto && (
                    <div className="border-t border-gray-100 px-5 py-5">
                      <div className="grid md:grid-cols-2 gap-8">
                        {SECOES.map(secao => {
                          const camposComValor = secao.campos.filter(c => {
                            const raw = dados[c.key];
                            const val = c.fmt ? c.fmt(raw) : raw;
                            return val !== null && val !== undefined && val !== "";
                          });
                          if (camposComValor.length === 0) return null;
                          return (
                            <div key={secao.titulo}>
                              <p className="text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-3">
                                {secao.titulo}
                              </p>
                              <div className="space-y-1.5">
                                {camposComValor.map(c => {
                                  const raw = dados[c.key];
                                  const val = c.fmt ? c.fmt(raw) : raw;
                                  return <Campo key={c.key} label={c.label} valor={val} />;
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Histórico de progresso */}
                      {perfil.historico_progressos?.length > 0 && (
                        <div className="mt-6 border-t border-gray-100 pt-5">
                          <p className="text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-3">
                            Histórico de progresso ({perfil.historico_progressos.length} registros)
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100">
                                  <th className="text-left pb-2 font-medium">Data</th>
                                  <th className="text-left pb-2 font-medium">Peso</th>
                                  <th className="text-left pb-2 font-medium">Observações</th>
                                  <th className="text-left pb-2 font-medium">Fotos</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {perfil.historico_progressos.map(h => (
                                  <tr key={h.id} className="py-2">
                                    <td className="py-2 text-gray-600 whitespace-nowrap pr-4">
                                      {h.data ? new Date(h.data).toLocaleDateString("pt-BR") : "—"}
                                    </td>
                                    <td className="py-2 font-semibold text-gray-900 pr-4">
                                      {h.peso ? `${h.peso} kg` : "—"}
                                    </td>
                                    <td className="py-2 text-gray-500 pr-4">
                                      {h.obervacoes || "—"}
                                    </td>
                                    <td className="py-2">
                                      {h.fotos ? (
                                        <div className="flex gap-1">
                                          {parseArr(h.fotos).map((src, i) => (
                                            <a key={i} href={`http://localhost:3000${src}`} target="_blank" rel="noreferrer">
                                              <img src={`http://localhost:3000${src}`} alt={`foto ${i + 1}`} className="w-10 h-10 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                                            </a>
                                          ))}
                                        </div>
                                      ) : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
