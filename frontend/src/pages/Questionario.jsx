import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AppLayout from "../components/AppLayout";
import { api } from "../services/api";

const STEPS = [
  { title: "Objetivo principal", desc: "Essas perguntas definem toda a lógica do sistema." },
  { title: "Dados físicos", desc: "Esses dados são essenciais para cálculo calórico e treino." },
  { title: "Nível de experiência", desc: "Isso evita treinos inadequados." },
  { title: "Rotina e disponibilidade", desc: "Isso melhora aderência." },
  { title: "Estrutura disponível", desc: "Muito importante para gerar treino correto." },
  { title: "Restrições físicas e saúde", desc: "Aqui entra o cuidado mais importante." },
  { title: "Preferências do treino", desc: "Isso melhora retenção do usuário." },
];

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

const INIT = {
  objetivo: [], objetivo_outro: "", resultado_satisfatorio: "",
  data_nascimento: "", sexo: "", altura: "", peso: "", peso_desejado: "", percentual_gordura: "", medidas_corporais: "",
  nivel_musculacao: "", sabe_executar_basicos: "",
  dias_disponiveis: [], tempo_por_treino: "", nivel_atv_fisica: "",
  local_treino: [], local_treino_outro: "", preferencia_treino: [], preferencia_treino_outro: "", modalidades: [],
  tem_lesao: "", tem_lesao_desc: "", dores_frequentes: "", dores_frequentes_desc: "", limitacao_fisica: "", limitacao_fisica_desc: "", exercicio_desconforto: "", exercicio_desconforto_desc: "",
  obervacoes: "",
  treino_dividido: "",
  exercicios_favoritos: "", exercicios_odeia: "",
  modalidade_outra: "",
};

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 space-y-4 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{children}</p>;
}

export default function Questionario() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INIT);
  const [parq, setParq] = useState(Array(10).fill(false));
  const [fotos, setFotos] = useState([]);
  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    api.get("/usuario/perfil-fisico").then((data) => {
      if (!data) return;
      const safe = (v) => v ?? "";
      const arr = (v) => { try { return v ? JSON.parse(v) : []; } catch { return []; } };
      setForm({
        objetivo: arr(data.objetivo), objetivo_outro: "",
        resultado_satisfatorio: safe(data.resultado_satisfatorio),
        data_nascimento: safe(data.data_nascimento), sexo: safe(data.sexo), altura: safe(data.altura),
        peso: safe(data.peso), peso_desejado: safe(data.peso_desejado),
        percentual_gordura: safe(data.percentual_gordura), medidas_corporais: safe(data.medidas_corporais),
        nivel_musculacao: safe(data.nivel_musculacao),
        sabe_executar_basicos: safe(data.sabe_executar_basicos),
        dias_disponiveis: arr(data.dias_disponiveis), tempo_por_treino: safe(data.tempo_por_treino),
        nivel_atv_fisica: safe(data.nivel_atv_fisica),
        local_treino: arr(data.local_treino), local_treino_outro: "",
        preferencia_treino: arr(data.preferencia_treino), preferencia_treino_outro: "",
        modalidades: arr(data.modalidades),
        tem_lesao: safe(data.tem_lesao), tem_lesao_desc: safe(data.tem_lesao_desc),
        dores_frequentes: safe(data.dores_frequentes), dores_frequentes_desc: safe(data.dores_frequentes_desc),
        limitacao_fisica: safe(data.limitacao_fisica), limitacao_fisica_desc: safe(data.limitacao_fisica_desc),
        exercicio_desconforto: safe(data.exercicio_desconforto), exercicio_desconforto_desc: safe(data.exercicio_desconforto_desc),
        obervacoes: safe(data.obervacoes),
        treino_dividido: safe(data.treino_dividido),
        exercicios_favoritos: safe(data.exercicios_favoritos), exercicios_odeia: safe(data.exercicios_odeia),
        modalidade_outra: safe(data.modalidade_outra),
      });
      if (data.parq) { try { setParq(JSON.parse(data.parq)); } catch {} }
      setHasProfile(true);
    }).catch(() => {});
  }, []);

  const sf = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggle = (field, value) =>
    setForm((prev) => {
      const a = Array.isArray(prev[field]) ? prev[field] : [];
      return { ...prev, [field]: a.includes(value) ? a.filter((v) => v !== value) : [...a, value] };
    });

  const canProceed = () => {
    switch (step) {
      case 1: return form.objetivo.length > 0;
      case 2: return !!(form.data_nascimento && form.altura && form.peso);
      case 3: return !!form.nivel_musculacao;
      case 4: return !!(form.dias_disponiveis.length > 0 && form.nivel_atv_fisica);
      case 5: return form.local_treino.length > 0;
      case 6: return !!(
        form.tem_lesao &&
        (form.tem_lesao === 'nao' || form.tem_lesao_desc.trim()) &&
        (form.dores_frequentes === 'nao' || !form.dores_frequentes || form.dores_frequentes_desc.trim()) &&
        (form.limitacao_fisica === 'nao' || !form.limitacao_fisica || form.limitacao_fisica_desc.trim()) &&
        (form.exercicio_desconforto === 'nao' || !form.exercicio_desconforto || form.exercicio_desconforto_desc.trim())
      );
      default: return true;
    }
  };

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

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      const idade = form.data_nascimento
        ? Math.floor((Date.now() - new Date(form.data_nascimento)) / (365.25 * 24 * 3600 * 1000))
        : "";
      const objetivoFinais = form.objetivo.map(o =>
        o === "outros" && form.objetivo_outro.trim() ? form.objetivo_outro.trim() : o
      );
      const modalidadesFinais = form.modalidades.map(m =>
        m === "outros" && form.modalidade_outra.trim() ? form.modalidade_outra.trim() : m
      );
      const prefTreinoFinais = form.preferencia_treino.map(p =>
        p === "outros" && form.preferencia_treino_outro.trim() ? form.preferencia_treino_outro.trim() : p
      );
      const localTreinoFinais = form.local_treino.map(l =>
        l === "outros" && form.local_treino_outro.trim() ? form.local_treino_outro.trim() : l
      );
      const campos = {
        ...form,
        idade,
        objetivo: JSON.stringify(objetivoFinais),
        preferencia_treino: JSON.stringify(prefTreinoFinais),
        modalidades: JSON.stringify(modalidadesFinais),
        dias_disponiveis: JSON.stringify(form.dias_disponiveis),
        local_treino: JSON.stringify(localTreinoFinais),
        parq: JSON.stringify(parq),
      };
      Object.entries(campos).forEach(([k, v]) => fd.append(k, v));
      fotos.forEach(f => fd.append("fotos", f));
      await api.postForm("/usuario/perfil-fisico", fd);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao salvar perfil.");
      setLoading(false);
    }
  }

  // ── Helpers de UI (render functions, not components) ─────────────────────

  const choice = (field, value, label, desc) => {
    const active = form[field] === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => sf(field, value)}
        className={`w-full p-3 rounded-lg border text-sm text-left transition-colors flex items-center gap-2 ${
          active
            ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] font-medium"
            : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
        }`}
      >
        <span
          className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
            active ? "border-[#ff6600] bg-[#ff6600]" : "border-gray-400"
          }`}
        />
        <span>
          {label}
          {desc && <span className="text-xs text-gray-400 ml-2">{desc}</span>}
        </span>
      </button>
    );
  };

  const check = (field, value, label) => {
    const active = (form[field] || []).includes(value);
    return (
      <button
        key={value}
        type="button"
        onClick={() => toggle(field, value)}
        className={`p-3 rounded-lg border text-sm text-left transition-colors flex items-center gap-2 ${
          active
            ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] font-medium"
            : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
        }`}
      >
        <span
          className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            active ? "border-[#ff6600] bg-[#ff6600]" : "border-gray-400"
          }`}
        >
          {active && <span className="text-white text-[9px] leading-none">✓</span>}
        </span>
        {label}
      </button>
    );
  };

  const yesno = (field, label) => (
    <div>
      <p className="text-sm text-gray-700 mb-2">{label}</p>
      <div className="flex gap-2">
        {[["sim", "Sim"], ["nao", "Não"]].map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => sf(field, v)}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              form[field] === v
                ? v === "sim"
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-green-600 border-green-600 text-white"
                : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );

  const numInput = (field, label, placeholder) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1.5">{label}</label>
      <input
        type="number"
        value={form[field]}
        onChange={(e) => sf(field, e.target.value)}
        placeholder={placeholder}
        step="0.1"
        className="p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
      />
    </div>
  );

  const textInput = (field, label, placeholder) => (
    <div>
      <label className="text-sm text-gray-600 mb-1.5 block">{label}</label>
      <input
        type="text"
        value={form[field]}
        onChange={(e) => sf(field, e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
      />
    </div>
  );

  const textarea = (field, label, placeholder) => (
    <div>
      <label className="text-sm text-gray-600 mb-1.5 block">{label}</label>
      <textarea
        value={form[field]}
        onChange={(e) => sf(field, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors resize-none"
      />
    </div>
  );

  const gridBtn = (field, options, cols = "grid-cols-3") => (
    <div className={`grid ${cols} gap-2`}>
      {options.map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => sf(field, value)}
          className={`py-2.5 px-2 rounded-lg border text-sm text-center transition-colors ${
            form[field] === value
              ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] font-medium"
              : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const { title, desc } = STEPS[step - 1];
  const parqTemSim = parq.some(Boolean);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto pb-10">
        {/* Cabeçalho */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Perfil Físico</h1>
            <span className="text-sm text-gray-400 font-medium">{step} / {STEPS.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
            <div
              className="bg-[#ff6600] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Título da etapa */}
        <div className="mb-5 bg-orange-50 border border-orange-100 rounded-xl px-5 py-4 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-900">{step}. {title}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
          </div>
          <span className="text-xs text-[#ff6600] shrink-0 ml-4 mt-0.5">(obrigatório) = campo obrigatório</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* ── Etapa 1: Objetivo ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <Card>
              <Label>Qual é seu principal objetivo? <span className="text-[#ff6600] font-normal normal-case">(obrigatório, pode marcar mais de um)</span></Label>
              <div className="space-y-2">
                {check("objetivo", "emagrecimento", "Emagrecimento")}
                {check("objetivo", "ganho_de_massa", "Ganho de massa muscular")}
                {check("objetivo", "definicao", "Definição muscular")}
                {check("objetivo", "condicionamento", "Melhorar condicionamento")}
                {check("objetivo", "saude", "Saúde e qualidade de vida")}
                {check("objetivo", "forca", "Ganho de força")}
                {check("objetivo", "performance", "Performance esportiva")}
                {check("objetivo", "outros", "Outros")}
              </div>
              {form.objetivo.includes("outros") && (
                <input
                  type="text"
                  placeholder="Especifique seu objetivo..."
                  value={form.objetivo_outro}
                  onChange={e => sf("objetivo_outro", e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]"
                />
              )}
            </Card>
            <Card>
              {textarea("resultado_satisfatorio", "Qual seria um resultado satisfatório para você?", "Descreva como seria o resultado ideal...")}
            </Card>
          </div>
        )}

        {/* ── Etapa 2: Dados físicos ────────────────────────────────────── */}
        {step === 2 && (
          <Card>
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">Data de nascimento <span className="text-[#ff6600] text-xs">(obrigatório)</span></label>
              <input
                type="date"
                value={form.data_nascimento}
                onChange={e => sf("data_nascimento", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-[#ff6600] transition-colors"
              />
              {form.data_nascimento && (
                <p className="text-xs text-gray-400 mt-1.5">
                  {Math.floor((Date.now() - new Date(form.data_nascimento)) / (365.25 * 24 * 3600 * 1000))} anos
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {numInput("altura", "Altura (cm) (obrigatório)", "175")}
              {numInput("peso", "Peso atual (kg) (obrigatório)", "75.5")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {numInput("peso_desejado", "Peso desejado (kg)", "70")}
              {numInput("percentual_gordura", "% Gordura corporal (opcional)", "20")}
            </div>
            <div>
              <Label>Identidade de gênero</Label>
              <div className="grid grid-cols-2 gap-2">
                {choice("sexo", "masculino", "Masculino")}
                {choice("sexo", "feminino", "Feminino")}
                {choice("sexo", "trans_masculino", "Trans masculino")}
                {choice("sexo", "trans_feminino", "Trans feminino")}
                {choice("sexo", "nao_binario", "Não-binário")}
                {choice("sexo", "genero_fluido", "Gênero fluido")}
                {choice("sexo", "agênero", "Agênero")}
                {choice("sexo", "bigênero", "Bigênero")}
                {choice("sexo", "androginx", "Andrógino/Andrógina")}
                {choice("sexo", "intersexo", "Intersexo")}
                {choice("sexo", "queer", "Queer")}
                {choice("sexo", "prefiro_nao_informar", "Prefiro não informar")}
                <button
                  type="button"
                  onClick={() => sf("sexo", "outro")}
                  className={`p-3 rounded-lg border text-sm text-left transition-colors flex items-center gap-2 ${
                    form.sexo === "outro" || (form.sexo && !["masculino","feminino","trans_masculino","trans_feminino","nao_binario","genero_fluido","agênero","bigênero","androginx","intersexo","queer","prefiro_nao_informar"].includes(form.sexo))
                      ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] font-medium"
                      : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                    form.sexo === "outro" || (form.sexo && !["masculino","feminino","trans_masculino","trans_feminino","nao_binario","genero_fluido","agênero","bigênero","androginx","intersexo","queer","prefiro_nao_informar"].includes(form.sexo))
                      ? "border-[#ff6600] bg-[#ff6600]" : "border-gray-400"
                  }`} />
                  Outro
                </button>
              </div>
              {(form.sexo === "outro" || (form.sexo && !["masculino","feminino","trans_masculino","trans_feminino","nao_binario","genero_fluido","agênero","bigênero","androginx","intersexo","queer","prefiro_nao_informar","outro"].includes(form.sexo))) && (
                <input
                  type="text"
                  autoFocus
                  value={["outro"].includes(form.sexo) ? "" : form.sexo}
                  onChange={e => sf("sexo", e.target.value || "outro")}
                  placeholder="Descreva sua identidade de gênero..."
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-[#ff6600] focus:outline-none transition-colors"
                />
              )}
            </div>
            {textarea("medidas_corporais", "Medidas corporais (opcional)", "Ex: cintura 80cm, quadril 95cm, braço 35cm...")}
          </Card>
        )}

        {/* ── Etapa 3: Experiência ──────────────────────────────────────── */}
        {step === 3 && (
          <Card>
            <div>
              <Label>Qual seu nível de atividade física? <span className="text-[#ff6600] font-normal normal-case">(obrigatório)</span></Label>
              <div className="space-y-2">
                {choice("nivel_musculacao", "iniciante", "Iniciante", "Pouco ou nenhum exercício")}
                {choice("nivel_musculacao", "intermediario", "Intermediário", "Exercita-se regularmente")}
                {choice("nivel_musculacao", "avancado", "Avançado", "Treina com alta frequência e intensidade")}
              </div>
            </div>
            {yesno("sabe_executar_basicos", "Você sabe executar exercícios básicos? (agachamento, supino, etc.)")}
          </Card>
        )}

        {/* ── Etapa 4: Rotina ───────────────────────────────────────────── */}
        {step === 4 && (
          <Card>
            <div>
              <Label>Quais dias você tem disponibilidade para treinar? <span className="text-[#ff6600] font-normal normal-case">(obrigatório)</span></Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["segunda", "Segunda"],
                  ["terca", "Terça"],
                  ["quarta", "Quarta"],
                  ["quinta", "Quinta"],
                  ["sexta", "Sexta"],
                  ["sabado", "Sábado"],
                  ["domingo", "Domingo"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggle("dias_disponiveis", value)}
                    className={`py-2.5 rounded-lg border text-sm font-medium text-center transition-colors flex items-center justify-center gap-1.5 ${
                      (form.dias_disponiveis || []).includes(value)
                        ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600]"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      (form.dias_disponiveis || []).includes(value)
                        ? "border-[#ff6600] bg-[#ff6600]"
                        : "border-gray-400"
                    }`}>
                      {(form.dias_disponiveis || []).includes(value) && (
                        <span className="text-white text-[8px] leading-none">✓</span>
                      )}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
              {form.dias_disponiveis.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {form.dias_disponiveis.length} dia{form.dias_disponiveis.length > 1 ? "s" : ""} selecionado{form.dias_disponiveis.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div>
              <Label>Quanto tempo por treino?</Label>
              {gridBtn("tempo_por_treino", [
                ["30min", "30 min"],
                ["45min", "45 min"],
                ["1h", "1 hora"],
                ["1h30", "1h30"],
                ["2h", "2 horas"],
                ["mais_2h", "Mais de 2h"],
              ])}
            </div>
            <div>
              <Label>Sua rotina é: <span className="text-[#ff6600] font-normal normal-case">(obrigatório)</span></Label>
              <div className="space-y-2">
                {choice("nivel_atv_fisica", "sedentario", "Sedentária", "Fico quase sempre sentado")}
                {choice("nivel_atv_fisica", "leve", "Levemente ativa", "Caminho um pouco")}
                {choice("nivel_atv_fisica", "moderado", "Ativa", "Atividade moderada no dia a dia")}
                {choice("nivel_atv_fisica", "intenso", "Muito ativa", "Trabalho físico ou muito movimento")}
              </div>
            </div>
          </Card>
        )}

        {/* ── Etapa 5: Estrutura ────────────────────────────────────────── */}
        {step === 5 && (
          <Card>
            <div>
              <Label>Onde pretende treinar? <span className="text-[#ff6600] font-normal normal-case">(obrigatório, pode marcar mais de um)</span></Label>
              <div className="grid grid-cols-3 gap-2">
                {check("local_treino", "academia", "Academia")}
                {check("local_treino", "casa", "Casa")}
                {check("local_treino", "ar_livre", "Ar livre")}
                {check("local_treino", "outros", "Outros")}
              </div>
              {form.local_treino.includes("outros") && (
                <input
                  type="text"
                  placeholder="Especifique onde você treina..."
                  value={form.local_treino_outro}
                  onChange={e => sf("local_treino_outro", e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]"
                />
              )}
            </div>
            <div>
              <Label>Você prefere: (pode marcar mais de um)</Label>
              <div className="grid grid-cols-2 gap-2">
                {check("preferencia_treino", "peso_livre", "Peso livre")}
                {check("preferencia_treino", "maquinas", "Máquinas")}
                {check("preferencia_treino", "funcional", "Funcional")}
                {check("preferencia_treino", "cardio", "Cardio")}
                {check("preferencia_treino", "calistenia", "Calistenia")}
                {check("preferencia_treino", "outros", "Outros")}
              </div>
              {form.preferencia_treino.includes("outros") && (
                <input
                  type="text"
                  placeholder="Especifique sua preferência..."
                  value={form.preferencia_treino_outro}
                  onChange={e => sf("preferencia_treino_outro", e.target.value)}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]"
                />
              )}
            </div>
            <div>
              <Label>Quais modalidades esportivas você gosta ou pratica? (pode marcar mais de um)</Label>
              <div className="grid grid-cols-2 gap-2">
                {check("modalidades", "musculacao", "Musculação")}
                {check("modalidades", "natacao", "Natação")}
                {check("modalidades", "corrida", "Corrida")}
                {check("modalidades", "ciclismo", "Ciclismo")}
                {check("modalidades", "futebol", "Futebol")}
                {check("modalidades", "basquete", "Basquete")}
                {check("modalidades", "volei", "Vôlei")}
                {check("modalidades", "lutas", "Lutas / Artes Marciais")}
                {check("modalidades", "crossfit", "CrossFit")}
                {check("modalidades", "yoga_pilates", "Yoga / Pilates")}
                {check("modalidades", "tenis", "Tênis")}
                {check("modalidades", "danca", "Dança")}
                {check("modalidades", "surf", "Surf")}
                <button
                  type="button"
                  onClick={() => toggle("modalidades", "outros")}
                  className={`p-3 rounded-lg border text-sm text-left transition-colors flex items-center gap-2 ${
                    (form.modalidades || []).includes("outros")
                      ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600] font-medium"
                      : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    (form.modalidades || []).includes("outros")
                      ? "border-[#ff6600] bg-[#ff6600]" : "border-gray-400"
                  }`}>
                    {(form.modalidades || []).includes("outros") && (
                      <span className="text-white text-[9px] leading-none">✓</span>
                    )}
                  </span>
                  Outro
                </button>
              </div>
              {(form.modalidades || []).includes("outros") && (
                <input
                  type="text"
                  autoFocus
                  value={form.modalidade_outra}
                  onChange={e => sf("modalidade_outra", e.target.value)}
                  placeholder="Qual modalidade? Ex: Padel, Skate, Escalada..."
                  className="mt-2 w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-[#ff6600] focus:outline-none transition-colors"
                />
              )}
            </div>
          </Card>
        )}

        {/* ── Etapa 6: Saúde ────────────────────────────────────────────── */}
        {step === 6 && (
          <div className="space-y-4">
            <Card>
              <Label>Restrições físicas</Label>
              <div className="space-y-3">
                {yesno("tem_lesao", "Você possui alguma lesão? (obrigatório)")}
                {form.tem_lesao === "sim" && (
                  <div>
                    <p className="text-xs text-[#ff6600] font-semibold mb-1">Descrição obrigatória <span className="text-red-500">*</span></p>
                    <input type="text" placeholder="Descreva a lesão..." value={form.tem_lesao_desc}
                      onChange={e => sf("tem_lesao_desc", e.target.value)}
                      className="w-full border border-[#ff6600] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]" />
                  </div>
                )}
                {yesno("dores_frequentes", "Tem dores frequentes?")}
                {form.dores_frequentes === "sim" && (
                  <div>
                    <p className="text-xs text-[#ff6600] font-semibold mb-1">Descrição obrigatória <span className="text-red-500">*</span></p>
                    <input type="text" placeholder="Descreva as dores..." value={form.dores_frequentes_desc}
                      onChange={e => sf("dores_frequentes_desc", e.target.value)}
                      className="w-full border border-[#ff6600] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]" />
                  </div>
                )}
                {yesno("limitacao_fisica", "Possui alguma limitação física?")}
                {form.limitacao_fisica === "sim" && (
                  <div>
                    <p className="text-xs text-[#ff6600] font-semibold mb-1">Descrição obrigatória <span className="text-red-500">*</span></p>
                    <input type="text" placeholder="Descreva a limitação..." value={form.limitacao_fisica_desc}
                      onChange={e => sf("limitacao_fisica_desc", e.target.value)}
                      className="w-full border border-[#ff6600] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]" />
                  </div>
                )}
                {yesno("exercicio_desconforto", "Algum exercício causa desconforto?")}
                {form.exercicio_desconforto === "sim" && (
                  <div>
                    <p className="text-xs text-[#ff6600] font-semibold mb-1">Descrição obrigatória <span className="text-red-500">*</span></p>
                    <input type="text" placeholder="Descreva o exercício e o desconforto..." value={form.exercicio_desconforto_desc}
                      onChange={e => sf("exercicio_desconforto_desc", e.target.value)}
                      className="w-full border border-[#ff6600] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#ff6600]" />
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Questionário PAR-Q</h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Physical Activity Readiness — responda com sinceridade.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {PARQ_PERGUNTAS.map((pergunta, i) => (
                  <div
                    key={i}
                    className={`flex items-start justify-between gap-4 p-3.5 rounded-lg border transition-colors ${
                      parq[i] ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <p className={`text-sm flex-1 ${parq[i] ? "text-red-700" : "text-gray-600"}`}>
                      <span className="font-semibold text-gray-400 mr-2">{i + 1}.</span>
                      {pergunta}
                    </p>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setParq((p) => p.map((v, j) => (j === i ? true : v)))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          parq[i]
                            ? "bg-red-500 border-red-500 text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500"
                        }`}
                      >
                        SIM
                      </button>
                      <button
                        type="button"
                        onClick={() => setParq((p) => p.map((v, j) => (j === i ? false : v)))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          !parq[i]
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:border-green-300 hover:text-green-500"
                        }`}
                      >
                        NÃO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {parqTemSim && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                  <span className="text-red-500 text-lg shrink-0">⚠️</span>
                  <div>
                    <p className="text-red-700 font-semibold text-sm">Consulte um médico antes de iniciar</p>
                    <p className="text-red-600 text-xs mt-1">
                      Você respondeu SIM para uma ou mais perguntas. Recomendamos avaliação médica
                      antes de iniciar treinos intensos. Seu plano será adaptado com segurança.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Card>
              {textarea("obervacoes", "Observações adicionais", "")}
            </Card>
          </div>
        )}

        {/* ── Etapa 7: Preferências ─────────────────────────────────────── */}
        {step === 7 && (
          <Card>
            <div>
              <Label>Fotos do corpo (opcional)</Label>
              <p className="text-xs text-gray-400 mb-1">Envie até 3 fotos para acompanhar sua evolução visual.</p>
              <p className="text-xs text-gray-400 mb-3">📸 <strong>Frente</strong> · <strong>Costas</strong> · <strong>Lado</strong></p>
              {fotoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {fotoPreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <p className="text-[10px] text-center text-gray-400 mb-1">{["Frente", "Costas", "Lado"][i]}</p>
                      <img src={src} alt={`preview ${i + 1}`} className="w-full h-24 object-contain rounded-lg bg-gray-50 border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removerFoto(i)}
                        className="absolute top-5 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fotos.length < 3 && (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#ff6600] transition-colors bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm">Adicionar foto {["(Frente)", "(Costas)", "(Lado)"][fotos.length]}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFotos} />
                </label>
              )}
            </div>
            <div>
              <Label>Prefere treino:</Label>
              <div className="space-y-2">
                {choice("treino_dividido", "dividido", "Dividido", "Ex: A/B/C por grupo muscular")}
                {choice("treino_dividido", "full_body", "Corpo inteiro", "Full body em cada sessão")}
              </div>
            </div>
            {textarea("exercicios_favoritos", "Tem exercícios favoritos?", "Ex: agachamento, supino reto, pull-up...")}
            {textarea("exercicios_odeia", "Tem exercícios que você não gosta?", "Ex: leg press, abdominal, corrida...")}
          </Card>
        )}

        {/* ── Navegação ─────────────────────────────────────────────────── */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:border-gray-400 transition-colors"
            >
              Voltar
            </button>
          )}
          {step < STEPS.length ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-[#ff6600] py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : hasProfile ? "Atualizar perfil" : "Salvar perfil"}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
