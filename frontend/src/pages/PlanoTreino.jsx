import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";
import { Link } from "react-router";

const DIA_CORES = [
  "border-l-orange-400",
  "border-l-blue-400",
  "border-l-green-400",
  "border-l-purple-400",
  "border-l-red-400",
  "border-l-yellow-400",
  "border-l-gray-300",
];

const DIA_BADGES = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-red-100 text-red-600",
  "bg-yellow-100 text-yellow-700",
  "bg-gray-100 text-gray-500",
];

export default function PlanoTreino() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => { carregarPlano(); }, []);

  async function carregarPlano() {
    setLoading(true);
    try {
      const lista = await api.get("/plano-treino/");
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
      const novo = await api.post("/plano-treino/gerar");
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
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">🏋️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum plano gerado ainda</h2>
          <p className="text-gray-400 mb-6">Gere seu plano de treino personalizado com IA.</p>
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

  const dias = parseTreino(plano.descricao);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano de Treino</h1>
            {plano.objetivo && (
              <span className="inline-block mt-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#ff6600] text-xs font-semibold rounded-full uppercase tracking-wide">
                {plano.objetivo.replace(/_/g, " ")}
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
            <p className="text-[#ff6600] text-sm font-medium">A IA está criando seu plano personalizado, aguarde...</p>
          </div>
        )}

        {/* Dias */}
        {dias.length > 0 ? (
          <div className="space-y-4">
            {dias.map((dia, i) => (
              <div key={i} className={`bg-white border border-gray-100 border-l-4 ${DIA_CORES[i % DIA_CORES.length]} rounded-xl shadow-sm overflow-hidden`}>
                {/* Cabeçalho do dia */}
                <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${DIA_BADGES[i % DIA_BADGES.length]}`}>
                      {extrairDia(dia.titulo)}
                    </span>
                    {extrairSubtitulo(dia.titulo) && (
                      <span className="text-gray-700 font-semibold text-sm">{extrairSubtitulo(dia.titulo)}</span>
                    )}
                  </div>
                </div>

                {/* Exercícios */}
                <div className="px-5 py-4">
                  {dia.itens.length > 0 ? (
                    <ul className="space-y-2">
                      {dia.itens.map((item, j) => {
                        const { nome, series } = parseExercicio(item);
                        return (
                          <li key={j} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
                            <span className="flex items-center gap-2 text-gray-700 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600] shrink-0" />
                              {nome}
                            </span>
                            {series && (
                              <span className="shrink-0 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                                {series}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{dia.texto}</p>
                  )}
                </div>
              </div>
            ))}
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
    .replace(/^[-–—]{3,}$/gm, "")
    .trim();
}

function parseTreino(texto) {
  if (!texto) return [];
  const linhas = texto.split("\n");
  const regex = /^[#*\s]*(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|dia\s*\d)/i;
  const inicio = linhas.findIndex(l => regex.test(l.trim()));
  if (inicio === -1) return [];
  const blocos = [];
  let atual = null;
  for (let i = inicio; i < linhas.length; i++) {
    const linha = limparMd(linhas[i]);
    if (!linha) continue;
    if (regex.test(linha)) {
      if (atual) blocos.push(atual);
      atual = { titulo: linha, itens: [], texto: "" };
    } else if (atual) {
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

function extrairDia(titulo) {
  const match = titulo.match(/^(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo|dia\s*\d+)/i);
  return match ? match[1] : titulo.split(/[—–:]/)[0].trim();
}

function extrairSubtitulo(titulo) {
  const partes = titulo.split(/[—–:]/);
  return partes.length > 1 ? partes.slice(1).join(" ").trim() : "";
}

function parseExercicio(texto) {
  const match = texto.match(/^(.+?)[\s:–—]+(\d+[xX×]\d+[\d\s\-+/a-zA-Z]*)$/);
  if (match) return { nome: match[1].trim(), series: match[2].trim() };
  const match2 = texto.match(/^(.+?)\s+[\[(](.+?)[\])]$/);
  if (match2) return { nome: match2[1].trim(), series: match2[2].trim() };
  return { nome: texto, series: "" };
}
