import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";
import { Link } from "react-router";

const REFEICAO_CONFIG = {
  "café": { icon: "☀️", cor: "border-l-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
  "cafe": { icon: "☀️", cor: "border-l-yellow-400", badge: "bg-yellow-100 text-yellow-700" },
  "lanche da manhã": { icon: "🍎", cor: "border-l-green-300", badge: "bg-green-100 text-green-600" },
  "lanche da manha": { icon: "🍎", cor: "border-l-green-300", badge: "bg-green-100 text-green-600" },
  "almoço": { icon: "🍽️", cor: "border-l-blue-400", badge: "bg-blue-100 text-blue-600" },
  "almoco": { icon: "🍽️", cor: "border-l-blue-400", badge: "bg-blue-100 text-blue-600" },
  "lanche da tarde": { icon: "🥜", cor: "border-l-orange-300", badge: "bg-orange-100 text-orange-600" },
  "lanche pre": { icon: "⚡", cor: "border-l-orange-400", badge: "bg-orange-100 text-orange-600" },
  "lanche pré": { icon: "⚡", cor: "border-l-orange-400", badge: "bg-orange-100 text-orange-600" },
  "jantar": { icon: "🌙", cor: "border-l-purple-400", badge: "bg-purple-100 text-purple-600" },
  "ceia": { icon: "✨", cor: "border-l-indigo-300", badge: "bg-indigo-100 text-indigo-600" },
  "lanche": { icon: "🍎", cor: "border-l-green-300", badge: "bg-green-100 text-green-600" },
  "refeição": { icon: "🍽️", cor: "border-l-blue-400", badge: "bg-blue-100 text-blue-600" },
  "refeicao": { icon: "🍽️", cor: "border-l-blue-400", badge: "bg-blue-100 text-blue-600" },
};

function getConfig(titulo) {
  const t = titulo.toLowerCase();
  for (const key of Object.keys(REFEICAO_CONFIG)) {
    if (t.startsWith(key)) return REFEICAO_CONFIG[key];
  }
  return { icon: "🥗", cor: "border-l-gray-300", badge: "bg-gray-100 text-gray-600" };
}

export default function PlanoAlimentar() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => { carregarPlano(); }, []);

  async function carregarPlano() {
    setLoading(true);
    try {
      const lista = await api.get("/plano-alimentar/");
      setPlano(Array.isArray(lista) && lista.length > 0 ? lista[0] : null);
    } catch {
      setPlano(null);
    } finally {
      setLoading(false);
    }
  }

  async function gerarPlano() {
    setErro("");
    setGerando(true);
    try {
      const novo = await api.post("/plano-alimentar/gerar");
      setPlano(novo);
    } catch (err) {
      setErro(err.message || "Erro ao gerar plano.");
    } finally {
      setGerando(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!plano) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto text-center py-20">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">🥗</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum plano gerado ainda</h2>
          <p className="text-gray-400 mb-6">Gere seu plano alimentar personalizado com IA.</p>
          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={gerarPlano} disabled={gerando}
              className="bg-[#ff6600] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {gerando ? "Gerando com IA..." : "✦ Gerar plano com IA"}
            </button>
            <Link to="/questionario"
              className="border border-gray-200 px-6 py-3 rounded-lg font-semibold text-gray-600 hover:border-gray-400 transition-colors">
              Preencher perfil físico
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const refeicoes = parseAlimentar(plano.descricao);
  const totais = extrairTotais(plano.descricao);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano Alimentar</h1>
            {plano.calorias && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#ff6600] text-xs font-semibold rounded-full">
                🔥 {plano.calorias} kcal/dia
              </span>
            )}
          </div>
          <button onClick={gerarPlano} disabled={gerando}
            className="shrink-0 flex items-center gap-2 bg-[#ff6600] px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {gerando
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando...</>
              : "↺ Gerar novo"}
          </button>
        </div>

        {erro && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>
        )}

        {gerando && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#ff6600] border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-[#ff6600] text-sm font-medium">A IA está criando sua dieta personalizada, aguarde...</p>
          </div>
        )}

        {/* Refeições */}
        {refeicoes.length > 0 ? (
          <div className="space-y-4">
            {refeicoes.map((ref, i) => {
              const cfg = getConfig(ref.titulo);
              return (
                <div key={i} className={`bg-white border border-gray-100 border-l-4 ${cfg.cor} rounded-xl shadow-sm overflow-hidden`}>
                  {/* Cabeçalho */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cfg.icon}</span>
                      <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
                          {ref.titulo.split(/[—–:]/)[0].trim()}
                        </span>
                        {ref.horario && (
                          <span className="ml-2 text-gray-400 text-xs">{ref.horario}</span>
                        )}
                      </div>
                    </div>
                    {ref.calorias && (
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {ref.calorias}
                      </span>
                    )}
                  </div>

                  {/* Alimentos */}
                  <div className="px-5 py-4">
                    {ref.itens.length > 0 ? (
                      <ul className="space-y-2">
                        {ref.itens.map((item, j) => {
                          const { alimento, quantidade } = parseAlimento(item);
                          return (
                            <li key={j} className="flex items-center justify-between gap-3 py-1 border-b border-gray-50 last:border-0">
                              <span className="flex items-center gap-2 text-gray-700 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600] shrink-0" />
                                {alimento}
                              </span>
                              {quantidade && (
                                <span className="shrink-0 text-xs text-gray-400 font-medium">{quantidade}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{ref.texto}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Totais */}
            {totais && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-gray-700 font-semibold text-sm mb-3">Resumo nutricional</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {totais.map((t, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-0.5">{t.label}</p>
                      <p className="text-gray-900 font-bold text-sm">{t.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{plano.descricao}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function limparMd(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .trim();
}

function parseAlimentar(texto) {
  if (!texto) return [];
  const linhas = texto.split("\n");
  const regex = /^[#*\s\d.]*(café|cafe|lanche|almoço|almoco|jantar|ceia|refeição|refeicao)/i;
  const inicio = linhas.findIndex(l => regex.test(l.trim()));
  if (inicio === -1) return [];

  const blocos = [];
  let atual = null;

  for (let i = inicio; i < linhas.length; i++) {
    const linha = limparMd(linhas[i]);
    if (!linha) continue;

    if (regex.test(linha)) {
      if (atual) blocos.push(atual);
      const horarioMatch = linha.match(/(\d{1,2}[h:]\d{0,2})/i);
      const calMatch = linha.match(/(\d{3,4}\s*(?:kcal|cal))/i);
      atual = {
        titulo: linha.replace(/^\d+\.\s*/, "").replace(/[—–:]\s*\d{1,2}[h:]\d{0,2}/, "").replace(/\(.*?\)/, "").trim(),
        horario: horarioMatch ? horarioMatch[1] : "",
        calorias: calMatch ? calMatch[1] : "",
        itens: [],
        texto: "",
      };
    } else if (atual) {
      const calMatch = linha.match(/total[:\s]+(\d{3,4}\s*(?:kcal|cal))/i);
      if (calMatch && !atual.calorias) {
        atual.calorias = calMatch[1];
        continue;
      }
      if (/^[-•·*]\s+/.test(linhas[i].trim()) || /^\d+\.\s+/.test(linhas[i].trim())) {
        atual.itens.push(linha.replace(/^[-•·*\d.]\s+/, "").trim());
      } else {
        atual.texto += (atual.texto ? "\n" : "") + linha;
      }
    }
  }
  if (atual) blocos.push(atual);
  return blocos;
}

function extrairTotais(texto) {
  if (!texto) return null;
  const regexes = [
    { label: "Calorias", re: /total.*?(\d{3,4})\s*kcal/i },
    { label: "Proteínas", re: /proteína[s]?[:\s]+(\d+\s*g)/i },
    { label: "Carboidratos", re: /carboidrato[s]?[:\s]+(\d+\s*g)/i },
    { label: "Gorduras", re: /gordura[s]?[:\s]+(\d+\s*g)/i },
  ];
  const resultados = regexes
    .map(({ label, re }) => {
      const m = texto.match(re);
      return m ? { label, valor: m[1] + (label === "Calorias" ? " kcal" : "") } : null;
    })
    .filter(Boolean);
  return resultados.length >= 2 ? resultados : null;
}

function parseAlimento(texto) {
  const qtdPatterns = [
    /^(.+?)\s*[-–]\s*(\d[\d\s\w\/()]+(?:g|ml|unidade|fatia|colher|copo|xícara|porção)[s]?)$/i,
    /^(.+?)\s*\((\d[\d\s\w\/()]+(?:g|ml))\)$/i,
  ];
  for (const re of qtdPatterns) {
    const m = texto.match(re);
    if (m) return { alimento: m[1].trim(), quantidade: m[2].trim() };
  }
  return { alimento: texto, quantidade: "" };
}
