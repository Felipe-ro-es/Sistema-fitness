import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6 bg-gray-50 text-gray-900">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff6600]/30 bg-[#ff6600]/10 px-4 py-1.5 text-sm text-[#ff6600]">
        ⚡ Powered by Inteligência Artificial
      </span>

      <h1 className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight">
        Treinos e Dietas{" "}
        <span className="text-[#ff6600]">Personalizados</span> para Você
      </h1>

      <p className="mt-6 text-gray-400 max-w-2xl text-lg">
        Informe seus dados físicos, objetivos e rotina. Nossa IA cria
        automaticamente um plano completo de treino e alimentação para você
        alcançar seus resultados mais rápido.
      </p>

      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <Link
          to="/register"
          className="bg-[#ff6600] px-6 py-3 rounded-lg font-semibold text-white hover:bg-[#e55a00] transition-colors"
        >
          Criar conta
        </Link>
        <Link
          to="/login"
          className="border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-600 hover:border-gray-500 hover:text-gray-900 transition-colors"
        >
          Entrar
        </Link>
      </div>
    </section>
  );
}