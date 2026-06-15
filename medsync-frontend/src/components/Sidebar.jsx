import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  ClipboardCopy, 
  UserCog, 
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Pacientes', icon: Users, path: '/pacientes' },
    { name: 'Agenda', icon: CalendarDays, path: '/agenda' },
    { name: 'Prontuários', icon: ClipboardCopy, path: '/prontuarios' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="w-8 h-8 bg-[#0a1128] rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">MedSync</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Menu Principal</p>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${
              location.pathname === item.path 
                ? 'bg-[#0a1128] text-white' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}

        <p className="px-4 text-xs font-semibold text-slate-400 uppercase mt-6 mb-2 pt-4 border-t border-slate-100">Administração</p>
        <button className="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
          <UserCog className="w-5 h-5 mr-3" />
          <span className="font-medium">Usuários</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button onClick={() => navigate('/login')} className="flex items-center w-full px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}