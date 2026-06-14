import { useEffect, useState } from "react";
import { Link } from "react-router";
import { personalApi } from "../services/api";
import { usePersonalAuth } from "../context/PersonalAuthContext";

const PARQ_PERGUNTAS = [
  "Algum médico já disse que você possui algum problema de coração ou pressão arterial, e que somente deveria realizar atividade física supervisionado por profissionais de saúde?",
  "Você sente dores no peito quando pratica atividade física?",
  "No último mês, você sentiu dores no peito ao praticar atividade física?",
  "Você apresenta algum desequilíbrio devido à tontura e/ou perda momentânea da consciência?",
  "Você possui algum problema ósseo ou articular, que pode ser afetado ou agravado pela atividade física?",
  "Você toma atualmente algum tipo de medicação de uso contínuo?",
  "Você realiza algum tipo de tratamento médico para pressão arterial ou problemas cardíacos?",
  "Você realiza algum tratamento médico contínuo, que possa ser afetado ou prejudicado com a atividade física?",
  "Você já se submeteu a algum tipo de cirurgia, que comprometa de alguma forma a atividade física?",
  "Sabe de alguma outra razão pela qual a atividade física possa eventualmente comprometer sua saúde?",
];

const SECOES = [
  {
    titulo: "Objetivo",
    campos: [
      { label: "Objetivo principal", key: "objetivo", fmt: v => parseArr(v).map(o => o.replace(/_/g, " ")).join(", ") || v?.replace(/_/g, " ") },
      { label: "Resultado esperado", key: "resultado_satisfatorio" },
    ],
  },
  {
    titulo: "Dados físicos",
    campos: [
      { label: "Data de nascimento", key: "data_nascimento" },
      { label: "Sexo", key: "sexo" },
      { label: "Altura", key: "altura", fmt: v => v ? `${v} cm` : null },
      { label: "Peso atual", key: "peso", fmt: v => v ? `${v} kg` : null },
      { label: "Peso desejado", key: "peso_desejado", fmt: v => v ? `${v} kg` : null },
      { label: "% Gordura", key: "percentual_gordura", fmt: v => v ? `${v}%` : null },
      { label: "Medidas corporais", key: "medidas_corporais" },
    ],
  },
  {
    titulo: "Nível de experiência",
    campos: [
      { label: "Nível de atividade física", key: "nivel_musculacao" },
      { label: "Executa básicos?", key: "sabe_executar_basicos" },
    ],
  },
  {
    titulo: "Rotina e disponibilidade",
    campos: [
      { label: "Dias disponíveis", key: "dias_disponiveis", fmt: v => parseArr(v).join(", ") },
      { label: "Tempo por treino", key: "tempo_por_treino" },
      { label: "Nível de atividade diária", key: "nivel_atv_fisica" },
    ],
  },
  {
    titulo: "Estrutura disponível",
    campos: [
      { label: "Local de treino", key: "local_treino", fmt: v => parseArr(v).join(", ") },
      { label: "Equipamentos", key: "equipamentos" },
      { label: "Preferência de treino", key: "preferencia_treino", fmt: v => parseArr(v).join(", ") },
      { label: "Modalidades", key: "modalidades", fmt: v => parseArr(v).join(", ") },
    ],
  },
  {
    titulo: "Preferências de treino",
    campos: [
      { label: "Tipo de treino", key: "treino_dividido" },
      { label: "Exercícios favoritos", key: "exercicios_favoritos" },
      { label: "Exercícios que não gosta", key: "exercicios_odeia" },
    ],
  },
  {
    titulo: "Observações",
    campos: [
      { label: "Observações adicionais", key: "obervacoes" },
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
  const isLongo = String(valor).length > 40;
  return (
    <div className={`text-sm ${isLongo ? "flex flex-col gap-0.5" : "flex gap-2"}`}>
      <span className="text-gray-400 shrink-0">{label}:</span>
      <span className="text-gray-800 font-medium break-words min-w-0">{String(valor)}</span>
    </div>
  );
}

export default function PersonalUsuarios() {
  const { personal } = usePersonalAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 shrink-0">
            Todos os usuários <span className="text-gray-400 font-normal text-base">({usuarios.length})</span>
          </h1>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full sm:max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]"
          />
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
            {usuarios.filter(perfil => {
              const nome = perfil.Usuario?.nome?.toLowerCase() ?? "";
              const email = perfil.Usuario?.email?.toLowerCase() ?? "";
              const q = busca.toLowerCase();
              return nome.includes(q) || email.includes(q);
            }).map(perfil => {
              const usuario = perfil.Usuario;
              const dados = flatten(perfil);
              const isAberto = aberto === perfil.id;
              const meuAluno = perfil.personalId === personal?.id;
              const objetivo = (() => {
                const arr = parseArr(dados.objetivo);
                if (arr.length > 0) return arr.map(o => o.replace(/_/g, " ")).join(", ");
                return dados.objetivo?.replace(/_/g, " ") ?? null;
              })();

              return (
                <div key={perfil.id} className={`bg-white rounded-xl overflow-hidden border ${meuAluno ? "border-[#ff6600]/30" : "border-gray-200"}`}>
                  {/* Cabeçalho do card */}
                  <button
                    onClick={() => setAberto(isAberto ? null : perfil.id)}
                    className="w-full flex items-start justify-between gap-4 p-5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${meuAluno ? "bg-[#ff6600] text-white" : "bg-[#ff6600]/10 text-[#ff6600]"}`}>
                        {usuario?.nome?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 break-words">{usuario?.nome ?? "—"}</p>
                        <p className="text-xs text-gray-400 break-words">{usuario?.email}</p>
                        {objetivo && (
                          <p className="text-xs text-[#ff6600] mt-0.5 break-words">{objetivo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {dados.peso && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
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

                      {/* Restrições físicas detalhadas */}
                      {perfil.SaudeRestricao && (
                        <div className="mt-6 border-t border-gray-100 pt-5">
                          <p className="text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-3">Restrições físicas</p>
                          <div className="space-y-2">
                            {[
                              { label: "Possui lesão?", key: "tem_lesao", desc: "tem_lesao_desc" },
                              { label: "Dores frequentes?", key: "dores_frequentes", desc: "dores_frequentes_desc" },
                              { label: "Limitação física?", key: "limitacao_fisica", desc: "limitacao_fisica_desc" },
                              { label: "Desconforto em exercício?", key: "exercicio_desconforto", desc: "exercicio_desconforto_desc" },
                            ].map(({ label, key, desc }) => {
                              const valor = dados[key];
                              const descricao = dados[desc];
                              if (!valor) return null;
                              const isSim = valor === "sim";
                              return (
                                <div key={key} className={`rounded-lg px-3 py-2 border text-sm ${isSim ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold text-xs ${isSim ? "text-red-500" : "text-gray-400"}`}>{isSim ? "SIM" : "NÃO"}</span>
                                    <span className="text-gray-600">{label}</span>
                                  </div>
                                  {isSim && descricao && (
                                    <p className="text-gray-700 mt-1 text-xs italic break-words whitespace-pre-wrap">"{descricao}"</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* PAR-Q */}
                      {perfil.SaudeRestricao?.parq && (() => {
                        let respostas = [];
                        try { respostas = JSON.parse(perfil.SaudeRestricao.parq); } catch {}
                        if (!respostas.length) return null;
                        return (
                          <div className="mt-6 border-t border-gray-100 pt-5">
                            <p className="text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-3">Questionário PAR-Q</p>
                            <div className="space-y-2">
                              {PARQ_PERGUNTAS.map((pergunta, i) => {
                                const isSim = respostas[i] === true;
                                return (
                                  <div key={i} className={`rounded-lg px-3 py-2 border text-sm ${isSim ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                                    <div className="flex gap-2">
                                      <span className={`font-bold text-xs shrink-0 mt-0.5 ${isSim ? "text-red-500" : "text-gray-400"}`}>{isSim ? "SIM" : "NÃO"}</span>
                                      <span className={`text-xs ${isSim ? "text-red-700 font-medium" : "text-gray-500"}`}>{i + 1}. {pergunta}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Histórico de progresso */}
                      {perfil.historico_progressos?.length > 0 && (
                        <div className="mt-6 border-t border-gray-100 pt-5">
                          <p className="text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-3">
                            Histórico de progresso ({perfil.historico_progressos.length} registros)
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm table-fixed">
                              <colgroup>
                                <col className="w-24" />
                                <col className="w-20" />
                                <col />
                                <col className="w-28" />
                              </colgroup>
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
                                  <tr key={h.id} className="align-top">
                                    <td className="py-2 text-gray-600 whitespace-nowrap pr-4">
                                      {h.data ? new Date(h.data).toLocaleDateString("pt-BR") : "—"}
                                    </td>
                                    <td className="py-2 font-semibold text-gray-900 pr-4">
                                      {h.peso ? `${h.peso} kg` : "—"}
                                    </td>
                                    <td className="py-2 text-gray-500 pr-4 break-words">
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
