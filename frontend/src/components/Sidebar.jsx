import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/questionario", label: "Perfil Físico", icon: "◎" },
  { to: "/plano-treino", label: "Plano de Treino", icon: "◈" },
  { to: "/plano-alimentar", label: "Plano Alimentar", icon: "◉" },
  { to: "/historico", label: "Histórico", icon: "◷" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <span className="font-bold text-xl text-gray-900">VITAL<span className="text-[#ff6600]">FIT</span></span>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ff6600] flex items-center justify-center font-bold text-gray-950">
            {user?.nome?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-gray-900 font-medium text-sm">{user?.nome ?? "Usuário"}</p>
            <p className="text-gray-400 text-xs truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#ff6600]/10 text-[#ff6600] font-medium"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-100 transition-colors"
        >
          <span>⏻</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
