import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">
      <h1 className="text-xl font-bold">FitnessAI</h1>

      <div className="flex gap-6">
        <Link to="/login" className="text-gray-300 hover:text-white">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Criar Conta
        </Link>
      </div>
    </nav>
  );
}