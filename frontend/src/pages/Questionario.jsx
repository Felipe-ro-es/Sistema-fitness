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
  { title: "Alimentação", desc: "Essencial para dieta personalizada." },
  { title: "Hábitos e estilo de vida", desc: "Isso impacta bastante resultado." },
  { title: "Preferências do treino", desc: "Isso melhora retenção do usuário." },
];

const PARQ_PERGUNTAS = [
  "Algum médico já disse que você possui problema cardíaco?",
  "Você sente dor no peito durante atividade física?",
  "Já perdeu equilíbrio ou consciência durante exercícios?",
  "Possui problema ósseo ou articular?",
  "Usa medicamentos para pressão ou coração?",
];

const INIT = {
  objetivo: "", prazo_objetivo: "", resultado_satisfatorio: "", tentou_antes: "",
  idade: "", sexo: "", altura: "", peso: "", peso_desejado: "", percentual_gordura: "", medidas_corporais: "",
  nivel_musculacao: "", tempo_treino: "", seguiu_dieta: "", sabe_executar_basicos: "",
  dias_disponiveis: [], tempo_por_treino: "", periodo_treino: "", nivel_atv_fisica: "", trabalho_postura: "",
  local_treino: "", equipamentos: "", academia_completa: "", preferencia_treino: [], modalidades: [],
  tem_lesao: "", dores_frequentes: "", limitacao_fisica: "", exercicio_desconforto: "",
  acompanhamento_medico: "", usa_medicamentos: "", obervacoes: "",
  refeicoes_dia: "", restricao_alimentar: [], alimentos_nao_gosta: "", alimentos_gosta: "",
  dificuldade_dieta: "", cozinha_refeicoes: "", gasto_alimentacao: "",
  horas_sono: "", nivel_estresse: "", agua_dia: "", consome_alcool: "", fuma: "", faz_cardio: "",
  preferencia_duracao_treino: "", gosta_cardio: "", treino_dividido: "",
  exercicios_favoritos: "", exercicios_odeia: "",
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
  const [parq, setParq] = useState(Array(5).fill(false));
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
        objetivo: safe(data.objetivo), prazo_objetivo: safe(data.prazo_objetivo),
        resultado_satisfatorio: safe(data.resultado_satisfatorio), tentou_antes: safe(data.tentou_antes),
        idade: safe(data.idade), sexo: safe(data.sexo), altura: safe(data.altura),
        peso: safe(data.peso), peso_desejado: safe(data.peso_desejado),
        percentual_gordura: safe(data.percentual_gordura), medidas_corporais: safe(data.medidas_corporais),
        nivel_musculacao: safe(data.nivel_musculacao), tempo_treino: safe(data.tempo_treino),
        seguiu_dieta: safe(data.seguiu_dieta), sabe_executar_basicos: safe(data.sabe_executar_basicos),
        dias_disponiveis: arr(data.dias_disponiveis), tempo_por_treino: safe(data.tempo_por_treino),
        periodo_treino: safe(data.periodo_treino), nivel_atv_fisica: safe(data.nivel_atv_fisica),
        trabalho_postura: safe(data.trabalho_postura), local_treino: safe(data.local_treino),
        equipamentos: safe(data.equipamentos), academia_completa: safe(data.academia_completa),
        preferencia_treino: arr(data.preferencia_treino),
        modalidades: arr(data.modalidades),
        tem_lesao: safe(data.tem_lesao), dores_frequentes: safe(data.dores_frequentes),
        limitacao_fisica: safe(data.limitacao_fisica), exercicio_desconforto: safe(data.exercicio_desconforto),
        acompanhamento_medico: safe(data.acompanhamento_medico), usa_medicamentos: safe(data.usa_medicamentos),
        obervacoes: safe(data.obervacoes), refeicoes_dia: safe(data.refeicoes_dia),
        restricao_alimentar: arr(data.restricao_alimentar),
        alimentos_nao_gosta: safe(data.alimentos_nao_gosta), alimentos_gosta: safe(data.alimentos_gosta),
        dificuldade_dieta: safe(data.dificuldade_dieta), cozinha_refeicoes: safe(data.cozinha_refeicoes),
        gasto_alimentacao: safe(data.gasto_alimentacao), horas_sono: safe(data.horas_sono),
        nivel_estresse: safe(data.nivel_estresse), agua_dia: safe(data.agua_dia),
        consome_alcool: safe(data.consome_alcool), fuma: safe(data.fuma), faz_cardio: safe(data.faz_cardio),
        preferencia_duracao_treino: safe(data.preferencia_duracao_treino),
        gosta_cardio: safe(data.gosta_cardio), treino_dividido: safe(data.treino_dividido),
        exercicios_favoritos: safe(data.exercicios_favoritos), exercicios_odeia: safe(data.exercicios_odeia),
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
      case 1: return !!form.objetivo;
      case 2: return !!(form.idade && form.altura && form.peso);
      case 3: return !!form.nivel_musculacao;
      case 4: return !!(form.dias_disponiveis.length > 0 && form.nivel_atv_fisica);
      case 5: return !!form.local_treino;
      case 6: return !!(form.tem_lesao && form.usa_medicamentos);
      case 7: return !!form.refeicoes_dia;
      case 8: return !!(form.horas_sono && form.nivel_estresse);
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
      const campos = {
        ...form,
        preferencia_treino: JSON.stringify(form.preferencia_treino),
        modalidades: JSON.stringify(form.modalidades),
        dias_disponiveis: JSON.stringify(form.dias_disponiveis),
        restricao_alimentar: JSON.stringify(form.restricao_alimentar),
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
        <div className="mb-5 bg-orange-50 border border-orange-100 rounded-xl px-5 py-4">
          <h2 className="font-bold text-gray-900">{step}. {title}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
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
              <Label>Qual é seu principal objetivo?</Label>
              <div className="space-y-2">
                {choice("objetivo", "emagrecimento", "Emagrecimento")}
                {choice("objetivo", "ganho_de_massa", "Ganho de massa muscular")}
                {choice("objetivo", "definicao", "Definição muscular")}
                {choice("objetivo", "condicionamento", "Melhorar condicionamento")}
                {choice("objetivo", "saude", "Saúde e qualidade de vida")}
                {choice("objetivo", "forca", "Ganho de força")}
                {choice("objetivo", "performance", "Performance esportiva")}
              </div>
            </Card>
            <Card>
              {textInput("prazo_objetivo", "Em quanto tempo deseja atingir resultados?", "Ex: 3 meses, 6 meses...")}
              {textarea("resultado_satisfatorio", "Qual seria um resultado satisfatório para você?", "Descreva como seria o resultado ideal...")}
              {yesno("tentou_antes", "Você já tentou atingir esse objetivo antes?")}
            </Card>
          </div>
        )}

        {/* ── Etapa 2: Dados físicos ────────────────────────────────────── */}
        {step === 2 && (
          <Card>
            <div className="grid grid-cols-3 gap-4">
              {numInput("idade", "Idade", "28")}
              {numInput("altura", "Altura (cm)", "175")}
              {numInput("peso", "Peso atual (kg)", "75.5")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {numInput("peso_desejado", "Peso desejado (kg)", "70")}
              {numInput("percentual_gordura", "% Gordura corporal (opcional)", "20")}
            </div>
            <div>
              <Label>Sexo</Label>
              <div className="grid grid-cols-2 gap-2">
                {choice("sexo", "masculino", "Masculino")}
                {choice("sexo", "feminino", "Feminino")}
              </div>
            </div>
            {textarea("medidas_corporais", "Medidas corporais (opcional)", "Ex: cintura 80cm, quadril 95cm, braço 35cm...")}
          </Card>
        )}

        {/* ── Etapa 3: Experiência ──────────────────────────────────────── */}
        {step === 3 && (
          <Card>
            <div>
              <Label>Qual seu nível na musculação?</Label>
              <div className="space-y-2">
                {choice("nivel_musculacao", "iniciante", "Iniciante", "Menos de 1 ano")}
                {choice("nivel_musculacao", "intermediario", "Intermediário", "1 a 3 anos")}
                {choice("nivel_musculacao", "avancado", "Avançado", "Mais de 3 anos")}
              </div>
            </div>
            <div>
              <Label>Há quanto tempo você treina?</Label>
              {gridBtn("tempo_treino", [
                ["nunca", "Nunca treinei"],
                ["menos_6m", "Menos de 6 meses"],
                ["6m_1a", "6 meses a 1 ano"],
                ["1a_3a", "1 a 3 anos"],
                ["3a_5a", "3 a 5 anos"],
                ["mais_5a", "Mais de 5 anos"],
              ])}
            </div>
            {yesno("seguiu_dieta", "Você já seguiu dieta antes?")}
            {yesno("sabe_executar_basicos", "Você sabe executar exercícios básicos? (agachamento, supino, etc.)")}
          </Card>
        )}

        {/* ── Etapa 4: Rotina ───────────────────────────────────────────── */}
        {step === 4 && (
          <Card>
            <div>
              <Label>Quais dias você tem disponibilidade para treinar?</Label>
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
              <Label>Qual período prefere treinar?</Label>
              <div className="grid grid-cols-3 gap-2">
                {choice("periodo_treino", "manha", "Manhã")}
                {choice("periodo_treino", "tarde", "Tarde")}
                {choice("periodo_treino", "noite", "Noite")}
              </div>
            </div>
            <div>
              <Label>Sua rotina é:</Label>
              <div className="space-y-2">
                {choice("nivel_atv_fisica", "sedentario", "Sedentária", "Fico quase sempre sentado")}
                {choice("nivel_atv_fisica", "leve", "Levemente ativa", "Caminho um pouco")}
                {choice("nivel_atv_fisica", "moderado", "Ativa", "Atividade moderada no dia a dia")}
                {choice("nivel_atv_fisica", "intenso", "Muito ativa", "Trabalho físico ou muito movimento")}
              </div>
            </div>
            <div>
              <Label>Você trabalha:</Label>
              <div className="grid grid-cols-3 gap-2">
                {choice("trabalho_postura", "sentado", "Sentado")}
                {choice("trabalho_postura", "em_pe", "Em pé")}
                {choice("trabalho_postura", "misto", "Misto")}
              </div>
            </div>
          </Card>
        )}

        {/* ── Etapa 5: Estrutura ────────────────────────────────────────── */}
        {step === 5 && (
          <Card>
            <div>
              <Label>Onde pretende treinar?</Label>
              <div className="grid grid-cols-3 gap-2">
                {choice("local_treino", "academia", "Academia")}
                {choice("local_treino", "casa", "Casa")}
                {choice("local_treino", "ar_livre", "Ar livre")}
              </div>
            </div>
            {textarea("equipamentos", "Quais equipamentos você possui?", "Ex: halteres, barra, elástico, esteira...")}
            {yesno("academia_completa", "Sua academia possui aparelhos completos?")}
            <div>
              <Label>Você prefere: (pode marcar mais de um)</Label>
              <div className="grid grid-cols-2 gap-2">
                {check("preferencia_treino", "peso_livre", "Peso livre")}
                {check("preferencia_treino", "maquinas", "Máquinas")}
                {check("preferencia_treino", "funcional", "Funcional")}
                {check("preferencia_treino", "cardio", "Cardio")}
                {check("preferencia_treino", "calistenia", "Calistenia")}
              </div>
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
                {check("modalidades", "outros", "Outros")}
              </div>
            </div>
          </Card>
        )}

        {/* ── Etapa 6: Saúde ────────────────────────────────────────────── */}
        {step === 6 && (
          <div className="space-y-4">
            <Card>
              <Label>Restrições físicas</Label>
              <div className="space-y-3">
                {yesno("tem_lesao", "Você possui alguma lesão?")}
                {yesno("dores_frequentes", "Tem dores frequentes?")}
                {yesno("limitacao_fisica", "Possui alguma limitação física?")}
                {yesno("exercicio_desconforto", "Algum exercício causa desconforto?")}
                {yesno("acompanhamento_medico", "Você possui acompanhamento médico?")}
                {yesno("usa_medicamentos", "Usa medicamentos continuamente?")}
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
              {textarea("obervacoes", "Observações adicionais (lesões, limitações, medicamentos...)", "Descreva qualquer informação relevante...")}
            </Card>
          </div>
        )}

        {/* ── Etapa 7: Alimentação ──────────────────────────────────────── */}
        {step === 7 && (
          <Card>
            <div>
              <Label>Quantas refeições faz por dia?</Label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => sf("refeicoes_dia", n)}
                    className={`py-2.5 rounded-lg border text-sm font-bold text-center transition-colors ${
                      form.refeicoes_dia === n
                        ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600]"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Tem alguma restrição alimentar? (pode marcar mais de um)</Label>
              <div className="grid grid-cols-2 gap-2">
                {check("restricao_alimentar", "lactose", "Lactose")}
                {check("restricao_alimentar", "gluten", "Glúten")}
                {check("restricao_alimentar", "vegetariano", "Vegetariano")}
                {check("restricao_alimentar", "vegano", "Vegano")}
                {check("restricao_alimentar", "alergias", "Alergias")}
              </div>
            </div>
            {textarea("alimentos_nao_gosta", "Quais alimentos você não gosta?", "Ex: brócolis, fígado, quiabo...")}
            {textarea("alimentos_gosta", "Quais alimentos você gosta muito?", "Ex: frango, arroz, ovos, frutas...")}
            {yesno("dificuldade_dieta", "Tem dificuldade em seguir dieta?")}
            {yesno("cozinha_refeicoes", "Você cozinha suas refeições?")}
            {textInput("gasto_alimentacao", "Quanto pretende gastar com alimentação por mês?", "Ex: R$ 500, R$ 1.000...")}
          </Card>
        )}

        {/* ── Etapa 8: Hábitos ──────────────────────────────────────────── */}
        {step === 8 && (
          <Card>
            <div>
              <Label>Quantas horas dorme por noite?</Label>
              <div className="grid grid-cols-7 gap-1.5">
                {[4, 5, 6, 7, 8, 9, 10].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => sf("horas_sono", h)}
                    className={`py-2.5 rounded-lg border text-sm font-bold text-center transition-colors ${
                      form.horas_sono === h
                        ? "border-[#ff6600] bg-[#ff6600]/10 text-[#ff6600]"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Como está seu nível de estresse?</Label>
              <div className="grid grid-cols-2 gap-2">
                {choice("nivel_estresse", "baixo", "Baixo")}
                {choice("nivel_estresse", "moderado", "Moderado")}
                {choice("nivel_estresse", "alto", "Alto")}
                {choice("nivel_estresse", "muito_alto", "Muito alto")}
              </div>
            </div>
            {textInput("agua_dia", "Quantidade de água por dia", "Ex: 2 litros, 3 litros...")}
            <div>
              <Label>Consome álcool?</Label>
              <div className="grid grid-cols-3 gap-2">
                {choice("consome_alcool", "sim", "Sim")}
                {choice("consome_alcool", "raramente", "Raramente")}
                {choice("consome_alcool", "nao", "Não")}
              </div>
            </div>
            {yesno("fuma", "Fuma?")}
            {yesno("faz_cardio", "Faz cardio atualmente?")}
          </Card>
        )}

        {/* ── Etapa 9: Preferências ─────────────────────────────────────── */}
        {step === 9 && (
          <Card>
            <div>
              <Label>Fotos do corpo (opcional — até 3)</Label>
              <p className="text-xs text-gray-400 mb-3">Adicione fotos para acompanhar sua evolução visual.</p>
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
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#ff6600] transition-colors bg-gray-50">
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
            <div>
              <Label>Você prefere treinos:</Label>
              <div className="space-y-2">
                {choice("preferencia_duracao_treino", "curto_intenso", "Curtos e intensos", "Alta intensidade em menos tempo")}
                {choice("preferencia_duracao_treino", "longo_moderado", "Longos e moderados", "Ritmo constante e sustentável")}
              </div>
            </div>
            {yesno("gosta_cardio", "Gosta de cardio?")}
            <div>
              <Label>Prefere treino:</Label>
              <div className="space-y-2">
                {choice("treino_dividido", "dividido", "Dividido", "Ex: A/B/C por grupo muscular")}
                {choice("treino_dividido", "full_body", "Corpo inteiro", "Full body em cada sessão")}
              </div>
            </div>
            {textarea("exercicios_favoritos", "Tem exercícios favoritos?", "Ex: agachamento, supino reto, pull-up...")}
            {textarea("exercicios_odeia", "Tem exercícios que odeia?", "Ex: leg press, abdominal, corrida...")}
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
