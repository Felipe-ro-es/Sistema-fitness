import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";
import { Link } from "react-router";

function formatObjetivo(v) {
  try {
    const arr = v ? JSON.parse(v) : [];
    if (arr.length > 0) return arr.map(s => s.replace(/_/g, " ")).join(", ");
  } catch {}
  return typeof v === "string" ? v.replace(/_/g, " ") : "—";
}

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

function PlanoAnterior({ plano }) {
  const dias = parseTreino(plano.descricao);
  return (
    <div className="opacity-80">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Plano atual (em vigor)</p>
      {dias.length > 0 ? (
        <div className="space-y-4">
          {dias.map((dia, i) => (
            <div key={i} className={`bg-white border border-gray-100 border-l-4 ${DIA_CORES[i % DIA_CORES.length]} rounded-xl shadow-sm overflow-hidden`}>
              <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${DIA_BADGES[i % DIA_BADGES.length]}`}>
                  {extrairDia(dia.titulo)}
                </span>
                {extrairSubtitulo(dia.titulo) && (
                  <span className="text-gray-700 font-semibold text-sm">{extrairSubtitulo(dia.titulo)}</span>
                )}
              </div>
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
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{plano.descricao}</p>
        </div>
      )}
    </div>
  );
}

export default function PlanoTreino() {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const [feedback, setFeedback] = useState("");
  const [salvandoFeedback, setSalvandoFeedback] = useState(false);
  const [feedbackSalvo, setFeedbackSalvo] = useState(false);

  useEffect(() => { carregarPlano(); }, []);

  async function fetchPlanos() {
    const lista = await api.get("/plano-treino/");
    if (!Array.isArray(lista) || lista.length === 0) { setPlano(null); return; }
    const maisRecente = lista[0];
    const anteriorValidado = lista.find((p, i) => i > 0 && p.status === "validado") ?? null;
    setPlano({ ...maisRecente, _anteriorValidado: anteriorValidado });
    if (maisRecente.feedback_usuario) setFeedback(maisRecente.feedback_usuario);
  }

  async function carregarPlano() {
    setLoading(true);
    try {
      await fetchPlanos();
    } catch {
      setPlano(null);
    } finally {
      setLoading(false);
    }
  }

  async function enviarFeedback() {
    if (!plano) return;
    const targetId = plano.status === "pendente" && plano._anteriorValidado
      ? plano._anteriorValidado.id
      : plano.id;
    setSalvandoFeedback(true);
    setFeedbackSalvo(false);
    try {
      await api.patch(`/plano-treino/${targetId}/feedback`, { feedback });
      setFeedbackSalvo(true);
      await fetchPlanos();
    } catch {
    } finally {
      setSalvandoFeedback(false);
    }
  }

  async function gerarPlano() {
    setErro("");
    setGerando(true);
    try {
      await api.post("/plano-treino/gerar");
      await fetchPlanos();
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
          <p className="text-gray-400 mb-6">Solicite seu plano de treino personalizado.</p>
          {erro && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={gerarPlano} disabled={gerando}
              className="bg-[#ff6600] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {gerando ? "Gerando..." : "✦ Gerar plano"}
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

  const emPendente = plano?.status === "pendente";
  const emRevisao = plano?.status === "revisao";
  const anterior = plano?._anteriorValidado ?? null;
  const planoExibido = emPendente ? anterior : plano;
  const feedbackId = plano?.status === "validado" ? plano.id : (emPendente && anterior ? anterior.id : null);
  const dias = planoExibido ? parseTreino(planoExibido.descricao) : [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Plano de Treino</h1>
            {(planoExibido?.objetivo || plano.objetivo) && (
              <p className="mt-2 text-xs font-semibold text-[#ff6600] uppercase tracking-wide break-words">
                {formatObjetivo(planoExibido?.objetivo || plano.objetivo)}
              </p>
            )}
          </div>
          <button onClick={gerarPlano} disabled={gerando}
            className="shrink-0 self-start flex items-center gap-2 bg-[#ff6600] px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {gerando
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Gerando...</>
              : "↺ Solicitar novo plano"}
          </button>
        </div>

        {/* Banners de status */}
        {emPendente && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
            <span className="text-lg shrink-0">⏳</span>
            <div>
              <p className="font-semibold text-yellow-800 text-sm">Novo plano aguardando validação</p>
              <p className="text-yellow-600 text-xs mt-0.5">
                {planoExibido ? "O anterior continua disponível abaixo enquanto o personal revisa." : "Seu plano está sendo revisado pelo personal trainer."}
              </p>
            </div>
          </div>
        )}
        {emRevisao && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <span className="text-lg shrink-0">💬</span>
            <div>
              <p className="font-semibold text-blue-800 text-sm">Feedback enviado ao personal trainer</p>
              <p className="text-blue-600 text-xs mt-0.5">O personal irá revisar e atualizar o plano com base no seu feedback.</p>
            </div>
          </div>
        )}

        {erro && <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>}
        {gerando && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#ff6600] border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-[#ff6600] text-sm font-medium">Gerando seu plano personalizado, aguarde...</p>
          </div>
        )}

        {/* Conteúdo do plano */}
        {planoExibido && (
          dias.length > 0 ? (
            <div className="space-y-4">
              {dias.map((dia, i) => (
                <div key={i} className={`bg-white border border-gray-100 border-l-4 ${DIA_CORES[i % DIA_CORES.length]} rounded-xl shadow-sm overflow-hidden`}>
                  <div className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${DIA_BADGES[i % DIA_BADGES.length]}`}>
                      {extrairDia(dia.titulo)}
                    </span>
                    {extrairSubtitulo(dia.titulo) && (
                      <span className="text-gray-700 font-semibold text-sm">{extrairSubtitulo(dia.titulo)}</span>
                    )}
                  </div>
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
              <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{planoExibido.descricao}</p>
            </div>
          )
        )}

        {/* Assinatura do personal — sempre visível se existir */}
        {(() => {
          const personal = planoExibido?.Personal ?? plano?.Personal;
          if (!personal) return null;
          return (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ff6600]/10 flex items-center justify-center font-bold text-[#ff6600] shrink-0">
                {personal.nome?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Plano validado por</p>
                <p className="font-semibold text-gray-900 text-sm">{personal.nome}</p>
                <p className="text-xs text-gray-400">CREF {personal.cref}</p>
              </div>
              <span className="ml-auto text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full font-medium">
                ✓ Validado
              </span>
            </div>
          );
        })()}

        {/* Feedback — sempre visível */}
        {feedbackId && (
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-900 mb-1">O que você mudaria neste plano?</p>
            <p className="text-xs text-gray-400 mb-3">Seu feedback será enviado ao personal trainer para ajustes futuros.</p>
            <textarea
              value={feedback}
              onChange={e => { setFeedback(e.target.value); setFeedbackSalvo(false); }}
              rows={4}
              placeholder="Ex: Gostaria de menos exercícios de perna, prefiro mais foco em costa e peito..."
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#ff6600] transition-colors resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              {feedbackSalvo && <span className="text-xs text-green-600 font-medium">✓ Feedback enviado com sucesso</span>}
              <button
                onClick={enviarFeedback}
                disabled={salvandoFeedback || !feedback.trim()}
                className="ml-auto bg-[#ff6600] px-5 py-2 rounded-lg text-sm font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvandoFeedback ? "Enviando..." : "Enviar feedback"}
              </button>
            </div>
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
