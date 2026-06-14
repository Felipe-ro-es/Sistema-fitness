import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { personalApi } from "../services/api";

const DIA_CORES = [
  "border-l-orange-400", "border-l-blue-400", "border-l-green-400",
  "border-l-purple-400", "border-l-red-400", "border-l-yellow-400", "border-l-gray-300",
];
const DIA_BADGES = [
  "bg-orange-100 text-orange-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600", "bg-red-100 text-red-600", "bg-yellow-100 text-yellow-700",
  "bg-gray-100 text-gray-500",
];

function formatObjetivo(v) {
  try {
    const arr = v ? JSON.parse(v) : [];
    if (arr.length > 0) return arr.map(s => s.replace(/_/g, " ")).join(", ");
  } catch {}
  return typeof v === "string" ? v.replace(/_/g, " ") : "—";
}

// ── parsers ──────────────────────────────────────────────────────────────────

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

function blocosParaTexto(blocos) {
  return blocos.map(b => {
    const linhas = [b.titulo];
    b.itens.forEach(item => linhas.push(`- ${item}`));
    if (b.texto) linhas.push(b.texto);
    return linhas.join("\n");
  }).join("\n\n");
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

// ── visualização somente leitura ──────────────────────────────────────────────

function PlanoVisualizado({ descricao }) {
  const dias = parseTreino(descricao);
  if (dias.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{descricao}</p>
      </div>
    );
  }
  return (
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
  );
}

// ── editor de blocos estilizado ───────────────────────────────────────────────

function EditorEstilizado({ descricao, onChange }) {
  const [blocos, setBlocos] = useState(() => parseTreino(descricao));

  function atualizarBlocos(novos) {
    setBlocos(novos);
    onChange(blocosParaTexto(novos));
  }

  function setTitulo(idx, valor) {
    const novos = blocos.map((b, i) => i === idx ? { ...b, titulo: valor } : b);
    atualizarBlocos(novos);
  }

  function setItem(idxBloco, idxItem, valor) {
    const novos = blocos.map((b, i) => {
      if (i !== idxBloco) return b;
      const itens = b.itens.map((it, j) => j === idxItem ? valor : it);
      return { ...b, itens };
    });
    atualizarBlocos(novos);
  }

  function addItem(idxBloco) {
    const novos = blocos.map((b, i) =>
      i === idxBloco ? { ...b, itens: [...b.itens, ""] } : b
    );
    atualizarBlocos(novos);
  }

  function removeItem(idxBloco, idxItem) {
    const novos = blocos.map((b, i) => {
      if (i !== idxBloco) return b;
      return { ...b, itens: b.itens.filter((_, j) => j !== idxItem) };
    });
    atualizarBlocos(novos);
  }

  function setTexto(idxBloco, valor) {
    const novos = blocos.map((b, i) => i === idxBloco ? { ...b, texto: valor } : b);
    atualizarBlocos(novos);
  }

  if (blocos.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-xs text-gray-400 mb-3">O plano não pôde ser parseado em blocos. Edite o texto diretamente:</p>
        <textarea
          value={descricao}
          onChange={e => onChange(e.target.value)}
          rows={20}
          className="w-full p-4 rounded-lg border border-gray-300 bg-gray-50 text-sm font-mono leading-relaxed text-gray-900 focus:outline-none focus:border-[#ff6600] transition-colors resize-y"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {blocos.map((bloco, i) => (
        <div key={i} className={`bg-white border border-gray-200 border-l-4 ${DIA_CORES[i % DIA_CORES.length]} rounded-xl shadow-sm overflow-hidden`}>
          {/* Cabeçalho editável */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shrink-0 ${DIA_BADGES[i % DIA_BADGES.length]}`}>
              {extrairDia(bloco.titulo) || `Dia ${i + 1}`}
            </span>
            <input
              type="text"
              value={bloco.titulo}
              onChange={e => setTitulo(i, e.target.value)}
              placeholder="Ex: Segunda — Peito e Tríceps"
              className="flex-1 text-sm font-semibold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-[#ff6600] focus:outline-none py-0.5 transition-colors"
            />
          </div>

          {/* Exercícios editáveis */}
          <div className="px-5 py-4 space-y-2">
            {bloco.itens.map((item, j) => {
              const { nome, series } = parseExercicio(item);
              return (
                <div key={j} className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-0 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600] shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={e => setItem(i, j, e.target.value)}
                    placeholder="Ex: Supino reto — 4x10-12"
                    className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none border-b border-transparent focus:border-dashed focus:border-gray-300 transition-colors py-0.5"
                  />
                  {series && (
                    <span className="shrink-0 px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full pointer-events-none">
                      {series}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(i, j)}
                    className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all text-lg leading-none shrink-0"
                    title="Remover exercício"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {bloco.texto && (
              <textarea
                value={bloco.texto}
                onChange={e => setTexto(i, e.target.value)}
                rows={3}
                className="w-full text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#ff6600] transition-colors resize-none mt-2"
              />
            )}

            <button
              type="button"
              onClick={() => addItem(i)}
              className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ff6600] transition-colors"
            >
              <span className="text-base leading-none">+</span> Adicionar exercício
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── página principal ──────────────────────────────────────────────────────────

export default function PersonalPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plano, setPlano] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [modo, setModo] = useState("visualizar");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    personalApi.get(`/personal/planos/${id}`)
      .then(data => { setPlano(data); setDescricao(data.descricao ?? ""); })
      .catch(() => setErro("Plano não encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleValidar() {
    setErro("");
    setSalvando(true);
    try {
      await personalApi.patch(`/personal/planos/${id}/validar`, { descricao });
      setSucesso(true);
      setTimeout(() => navigate("/personal/dashboard"), 1500);
    } catch (err) {
      setErro(err.message || "Erro ao validar plano.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const usuario = plano?.Perfilfisico?.Usuario;
  const jaValidado = plano?.status === "validado";
  const emRevisao = plano?.status === "revisao";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl text-gray-900">VITAL<span className="text-[#ff6600]">FIT</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500 font-medium">Revisão de Plano</span>
        </div>
        <Link to="/personal/dashboard" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ← Voltar ao painel
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Info do usuário */}
        {usuario && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ff6600]/10 flex items-center justify-center font-bold text-[#ff6600] text-lg shrink-0">
              {usuario.nome?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 break-words">{usuario.nome}</p>
              <p className="text-sm text-gray-400 break-words">{usuario.email}</p>
              {plano?.objetivo && (
                <p className="text-xs text-[#ff6600] mt-1 break-words">{formatObjetivo(plano.objetivo)}</p>
              )}
            </div>
            <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
              jaValidado ? "bg-green-100 text-green-700"
              : emRevisao ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
            }`}>
              {jaValidado ? "Validado" : emRevisao ? "Em revisão" : "Pendente"}
            </span>
          </div>
        )}

        {/* Feedback do aluno */}
        {plano?.feedback_usuario && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Feedback do aluno</p>
            <p className="text-sm text-blue-900 leading-relaxed break-words whitespace-pre-wrap">{plano.feedback_usuario}</p>
          </div>
        )}

        {erro && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{erro}</div>
        )}
        {sucesso && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            Plano validado com sucesso! Redirecionando...
          </div>
        )}

        {/* Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Plano de Treino</h2>
          {!jaValidado && (
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setModo("visualizar")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${modo === "visualizar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Visualizar
              </button>
              <button
                onClick={() => setModo("editar")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${modo === "editar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Editar
              </button>
            </div>
          )}
        </div>

        {modo === "visualizar" || (jaValidado && !emRevisao) ? (
          <PlanoVisualizado descricao={descricao} />
        ) : (
          <EditorEstilizado descricao={descricao} onChange={setDescricao} />
        )}

        {/* Ação */}
        {(!jaValidado || emRevisao) && (
          <div className="flex items-center justify-between gap-4 mt-6">
            <Link
              to="/personal/dashboard"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:border-gray-400 transition-colors"
            >
              Voltar sem validar
            </Link>
            <button
              onClick={handleValidar}
              disabled={salvando || !descricao.trim()}
              className="flex items-center gap-2 bg-green-600 px-8 py-3 rounded-lg font-semibold text-white text-sm hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {salvando
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Validando...</>
                : "✓ Validar e liberar para o aluno"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
