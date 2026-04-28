import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";

const objetivos = [
  { value: "perda_de_peso", label: "Perda de peso" },
  { value: "ganho_de_massa", label: "Ganho de massa muscular" },
  { value: "manutencao", label: "Manutenção do peso" },
  { value: "condicionamento", label: "Condicionamento físico" },
];

const niveisAtividade = [
  { value: "sedentario", label: "Sedentário", desc: "Pouco ou nenhum exercício" },
  { value: "leve", label: "Levemente ativo", desc: "Exercício 1-3x por semana" },
  { value: "moderado", label: "Moderadamente ativo", desc: "Exercício 3-5x por semana" },
  { value: "intenso", label: "Muito ativo", desc: "Exercício 6-7x por semana" },
  { value: "muito_intenso", label: "Extremamente ativo", desc: "Atleta ou trabalho físico pesado" },
];

export default function Questionario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    peso: "",
    altura: "",
    idade: "",
    objetivo: "",
    nivel_atv_fisica: "",
    obervacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    api.get("/perfil-fisico")
      .then((data) => {
        if (data) {
          setForm({
            peso: data.peso ?? "",
            altura: data.altura ?? "",
            idade: data.idade ?? "",
            objetivo: data.objetivo ?? "",
            nivel_atv_fisica: data.nivel_atv_fisica ?? "",
            obervacoes: data.obervacoes ?? "",
          });
          setHasProfile(true);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (hasProfile) {
        await api.put("/perfil-fisico", form);
      } else {
        await api.post("/perfil-fisico", form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Perfil Físico</h1>
          <p className="text-gray-400 mt-1">
            Preencha seus dados para criar planos personalizados para você.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados básicos */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-gray-900 font-semibold mb-4">Dados básicos</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "peso", label: "Peso (kg)", placeholder: "ex: 75.5", type: "number" },
                { name: "altura", label: "Altura (cm)", placeholder: "ex: 175", type: "number" },
                { name: "idade", label: "Idade", placeholder: "ex: 28", type: "number" },
              ].map(({ name, label, placeholder, type }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-gray-600 text-sm mb-1.5">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    step="0.1"
                    className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-gray-900 font-semibold mb-4">Qual é seu objetivo?</h2>
            <div className="grid grid-cols-2 gap-3">
              {objetivos.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, objetivo: value }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                    form.objetivo === value
                      ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600]"
                      : "border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Nível de atividade */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-gray-900 font-semibold mb-4">Nível de atividade física</h2>
            <div className="space-y-2">
              {niveisAtividade.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, nivel_atv_fisica: value }))}
                  className={`w-full p-3 rounded-lg border text-sm transition-colors text-left flex justify-between items-center ${
                    form.nivel_atv_fisica === value
                      ? "border-[#ff6600] bg-[#ff6600]/10"
                      : "border-gray-300 bg-gray-100 hover:border-gray-500"
                  }`}
                >
                  <span className={form.nivel_atv_fisica === value ? "text-[#ff6600] font-medium" : "text-gray-600"}>
                    {label}
                  </span>
                  <span className="text-gray-500 text-xs">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-gray-900 font-semibold mb-4">Observações, ex: alergias, problemas de saúde</h2>
            <textarea
              name="obervacoes"
              value={form.obervacoes}
              onChange={handleChange}
              placeholder="Alguma lesão, restrição alimentar, medicamento ou informação relevante..."
              rows={3}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.objetivo || !form.nivel_atv_fisica}
            className="w-full bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : hasProfile ? "Atualizar perfil" : "Salvar e gerar planos"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
