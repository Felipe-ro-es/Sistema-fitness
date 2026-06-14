import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";

const BASE_URL = "http://localhost:3000";

export default function Historico() {
  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({ peso: "", obervacoes: "" });
  const [fotos, setFotos] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletando, setDeletando] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchHistorico();
  }, []);

  async function fetchHistorico() {
    setLoading(true);
    try {
      const data = await api.get("/progresso");
      setRegistros(Array.isArray(data) ? data : []);
    } catch {
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFotos(e) {
    const novos = Array.from(e.target.files).slice(0, 3 - fotos.length);
    setFotos(prev => [...prev, ...novos].slice(0, 3));
    setFotoPreviews(prev => [...prev, ...novos.map(f => URL.createObjectURL(f))].slice(0, 3));
    e.target.value = "";
  }

  function removerFoto(i) {
    setFotos(prev => prev.filter((_, idx) => idx !== i));
    setFotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleDeletar(id) {
    setDeletando(id);
    try {
      await api.delete(`/progresso/${id}`);
      setRegistros(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message || "Erro ao deletar registro.");
    } finally {
      setDeletando(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("peso", form.peso);
      fd.append("obervacoes", form.obervacoes);
      fotos.forEach(f => fd.append("fotos", f));
      await api.postForm("/progresso", fd);
      setSuccess("Registro salvo com sucesso!");
      setForm({ peso: "", obervacoes: "" });
      setFotos([]);
      setFotoPreviews([]);
      fetchHistorico();
    } catch (err) {
      setError(err.message || "Erro ao salvar registro.");
    } finally {
      setSaving(false);
    }
  }

  const pesoInicial = registros.length > 0 ? registros[registros.length - 1].peso : null;
  const pesoAtual = registros.length > 0 ? registros[0].peso : null;
  const variacao = pesoInicial && pesoAtual ? (pesoAtual - pesoInicial).toFixed(1) : null;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Progresso</h1>
          <p className="text-gray-400 mt-1">Acompanhe sua evolução ao longo do tempo.</p>
        </div>

        {/* Stats */}
        {registros.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Peso inicial</p>
              <p className="text-gray-900 font-bold text-xl mt-1">{pesoInicial} kg</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Peso atual</p>
              <p className="text-gray-900 font-bold text-xl mt-1">{pesoAtual} kg</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-400 text-xs">Variação total</p>
              <p
                className={`font-bold text-xl mt-1 ${
                  variacao > 0 ? "text-red-400" : variacao < 0 ? "text-[#ff6600]" : "text-gray-900"
                }`}
              >
                {variacao > 0 ? "+" : ""}{variacao} kg
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-gray-900 font-semibold mb-4">Registrar novo progresso</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/30 text-[#ff6600] text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5">Peso atual (kg)</label>
              <input
                type="number"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="ex: 73.2"
                step="0.1"
                required
                className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5">Observações</label>
              <textarea
                name="obervacoes"
                value={form.obervacoes}
                onChange={handleChange}
                placeholder="Como você está se sentindo? Alguma medida adicional?"
                rows={2}
                className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1.5">
                Fotos de progresso (opcional — até 3)
              </label>
              {fotoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {fotoPreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt={`preview ${i + 1}`} className="w-full h-24 object-contain rounded-lg bg-gray-50 border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removerFoto(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fotos.length < 3 && (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ff6600] transition-colors bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">Adicionar foto ({fotos.length}/3)</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFotos} />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Salvando..." : "Registrar progresso"}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 className="text-gray-900 font-semibold mb-4">Registros anteriores</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : registros.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
              Nenhum registro ainda. Adicione seu primeiro progresso acima.
            </div>
          ) : (
            <div className="space-y-3">
              {registros.map((r, i) => (
                <div key={r.id ?? i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-900 font-semibold text-lg">{r.peso} kg</p>
                      {r.obervacoes && (
                        <p className="text-gray-400 text-sm mt-0.5 break-words whitespace-pre-wrap">{r.obervacoes}</p>
                      )}
                    </div>
                    <div className="flex items-start gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-gray-500 text-xs whitespace-nowrap">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                        {i > 0 && registros[i - 1] && (
                          <p
                            className={`text-xs mt-0.5 font-medium ${
                              r.peso < registros[i - 1].peso
                                ? "text-[#ff6600]"
                                : r.peso > registros[i - 1].peso
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {r.peso < registros[i - 1].peso ? "▼" : r.peso > registros[i - 1].peso ? "▲" : "—"}{" "}
                            {Math.abs(r.peso - registros[i - 1].peso).toFixed(1)} kg
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm("Deseja deletar este registro?")) {
                            handleDeletar(r.id);
                          }
                        }}
                        disabled={deletando === r.id}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Deletar registro"
                      >
                        {deletando === r.id
                          ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin block" />
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        }
                      </button>
                    </div>
                  </div>
                  {r.fotos && (() => {
                    try {
                      const lista = JSON.parse(r.fotos);
                      if (!lista.length) return null;
                      return (
                        <div className={`mt-3 grid gap-2 ${lista.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
                          {lista.map((src, i) => (
                            <img
                              key={i}
                              src={`${BASE_URL}${src}`}
                              alt={`Foto ${i + 1}`}
                              className="w-full max-h-72 object-contain rounded-lg border border-gray-100 bg-gray-50"
                            />
                          ))}
                        </div>
                      );
                    } catch { return null; }
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
