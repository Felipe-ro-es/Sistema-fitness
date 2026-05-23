import { Link } from "react-router";

export default function Navbar() {

  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-200/50">
      <Link to="/" className="text-xl font-bold text-gray-900">
        VITAL<span className="text-[#ff6600]">FIT</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <a href="#features" className="hover:text-gray-900 transition-colors">Funcionalidades</a>
        <a href="#how-it-works" className="hover:text-gray-900 transition-colors">Como funciona</a>
      </div>

      <div className="flex gap-3 items-center">
        <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
          Entrar
        </Link>
        <Link
          to="/register"
          className="bg-[#ff6600] px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#e55a00] transition-colors"
        >
          Criar conta
        </Link>
      </div>
    </nav>
  );
}