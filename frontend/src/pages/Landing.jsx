import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import { Link } from "react-router";

const features = [
  {
    icon: "◈",
    title: "Plano de Treino",
    desc: "Plano semanal personalizado de acordo com seu nível, objetivo e disponibilidade de tempo.",
  },
  {
    icon: "◷",
    title: "Histórico de Progresso",
    desc: "Registre seu peso e medidas ao longo do tempo e acompanhe sua evolução com gráficos.",
  },
  {
    icon: "◎",
    title: "Perfil Físico",
    desc: "Questionário completo para mapear seu nível de atividade, objetivo e condições físicas.",
  },
];

const steps = [
  { number: "01", title: "Crie sua conta", desc: "Cadastro rápido com nome, email e senha." },
  { number: "02", title: "Preencha seu perfil", desc: "Informe peso, altura, idade, objetivo e nível de atividade." },
  { number: "03", title: "Receba seu plano", desc: "Seu plano de treino é gerado automaticamente com base no seu perfil." },
  { number: "04", title: "Acompanhe o progresso", desc: "Registre sua evolução e ajuste os planos conforme necessário." },
];

export default function Landing() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Navbar />
      <Hero />

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Uma plataforma completa para transformar seu corpo com ciência e inteligência artificial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#ff6600]/40 transition-colors"
            >
              <div className="text-[#ff6600] text-2xl mb-4">{icon}</div>
              <h3 className="text-gray-900 font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Como funciona</h2>
            <p className="text-gray-400 mt-3">Simples, rápido e eficaz.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {steps.map(({ number, title, desc }) => (
              <div key={number} className="flex gap-5 items-start">
                <span className="text-[#ff6600] font-bold text-2xl mt-0.5 shrink-0">{number}</span>
                <div>
                  <h3 className="text-gray-900 font-semibold">{title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Pronto para transformar seu corpo?
        </h2>
        <p className="text-gray-400 mt-4 max-w-lg mx-auto">
          Crie sua conta e receba seu plano de treino totalmente personalizado.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            to="/register"
            className="inline-block bg-[#ff6600] px-8 py-3.5 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors"
          >
            Criar conta
          </Link>
          <Link
            to="/login"
            className="inline-block border border-gray-300 px-8 py-3.5 rounded-lg font-semibold text-gray-600 hover:border-gray-500 hover:text-gray-900 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} VITALFIT. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
