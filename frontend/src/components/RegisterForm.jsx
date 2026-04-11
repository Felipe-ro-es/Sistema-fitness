import { Link } from "react-router";

export default function RegisterForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <form className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Criar Conta
        </h2>

        <div className="flex flex-col mb-4">
          <label htmlFor="nome" className="text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite seu nome"
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu email"
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label htmlFor="password" className="text-gray-300 mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Digite sua senha"
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 py-3 rounded-lg font-semibold text-white hover:bg-green-600 transition"
        >
          Criar Conta
        </button>
        <Link to="/login" className="text-gray-300 hover:text-white flex items-center justify-center p-5">
          Já tem conta?
        </Link>
      </form>
      
    </div>
  );
}