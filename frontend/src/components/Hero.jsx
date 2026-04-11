import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gray-950 text-white">
      
      <h1 className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight">
        Treinos e Dietas Personalizados com Inteligência Artificial
      </h1>

      <p className="mt-6 text-gray-400 max-w-2xl text-lg">
        Informe seus dados físicos, objetivos e rotina. Nosso sistema cria
        automaticamente um plano completo de treino e alimentação para você
        alcançar seus resultados mais rápido.
      </p>

      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <Link to="/register" className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 w-50">
          Vamos começar⚡
        </Link>
      </div>

    </section>
  );
}