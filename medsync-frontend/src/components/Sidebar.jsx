import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardCopy,
  UserCog,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// Definição declarativa do menu, com a lista de roles que
// podem ver cada item. Espelha exatamente a tabela da seção
// 3.6 do enunciado:
//
//   Tela                      Recep.  Médico  Admin
//   Dashboard                   ✓       ✓       ✓
//   Cadastro de pacientes       ✓       —       ✓
//   Agendamento de consultas    ✓       —       ✓
//   Calendário de consultas     ✓       ✓       ✓
//   Prontuário do paciente      —       ✓       ✓
//   Cadastro de usuários        —       —       ✓
//
// Pacientes e Agenda aparecem como uma única entrada de menu
// cada (a tela em si decide o que renderizar: formulário de
// cadastro vs. apenas a lista, por exemplo), mas o ITEM DE MENU
// só aparece pra quem tem allowedRoles batendo com o role atual.
// ============================================================

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    allowedRoles: ["admin", "medico", "paciente"],
  },
  {
    name: "Pacientes",
    icon: Users,
    path: "/pacientes",
    allowedRoles: ["admin", "medico"], // Paciente não vê a lista de pacientes
  },
  {
    name: "Agenda",
    icon: CalendarDays,
    path: "/agenda",
    allowedRoles: ["admin", "medico", "paciente"],
  },
  {
    name: "Prontuários",
    icon: ClipboardCopy,
    path: "/prontuarios",
    allowedRoles: ["admin", "medico",],
  },
];

const adminItems = [
  {
    name: "Usuários",
    icon: UserCog,
    path: "/usuarios",
    allowedRoles: ["admin"],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout, hasAccess } = useAuth();

  // Filtra cada lista pelo role do usuário logado.
  const itensVisiveis = menuItems.filter((item) => hasAccess(item.allowedRoles));
  const itensAdminVisiveis = adminItems.filter((item) =>
    hasAccess(item.allowedRoles)
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Label amigável do role, usado no rodapé do cartão de usuário
  const roleLabel =
    { admin: "Administrador", medico: "Médico", recepcionista: "Recepcionista" }[
      role
    ] || "Usuário";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="w-8 h-8 bg-[#0a1128] rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">MedSync</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">
          Menu Principal
        </p>
        {itensVisiveis.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${
              location.pathname === item.path
                ? "bg-[#0a1128] text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}

        {/* Seção "Administração" só é renderizada se houver pelo
            menos um item visível dentro dela — evita mostrar um
            cabeçalho de seção vazio para médico/recepcionista. */}
        {itensAdminVisiveis.length > 0 && (
          <>
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mt-6 mb-2 pt-4 border-t border-slate-100">
              Administração
            </p>
            {itensAdminVisiveis.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? "bg-[#0a1128] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Cartão de usuário logado — mostra nome real e o role */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-[#ADD8E6] text-[#0a1128] flex items-center justify-center font-bold text-sm shrink-0">
            {(user?.nome || "U").substring(0, 2).toUpperCase()}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.nome || "Usuário"}
            </p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
