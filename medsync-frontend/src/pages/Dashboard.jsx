import { 
  CalendarDays, ClipboardCopy, Users, LayoutDashboard,
  Bell, Search, Clock, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const proximasConsultas = [
    { id: 1, paciente: "Mariana Costa", horario: "14:30", tipo: "Consulta Inicial", modalidade: "Presencial" },
    { id: 2, paciente: "Rodrigo Almeida", horario: "15:15", tipo: "Retorno", modalidade: "Online" },
    { id: 3, paciente: "Beatriz Santos", horario: "16:00", tipo: "Análise de Exames", modalidade: "Presencial" },
  ];

  const conveniosDistribuicao = [
    { nome: "Unimed", percentagem: 45, quantidade: 561, cor: "bg-emerald-500" },
    { nome: "Particular", percentagem: 30, quantidade: 374, cor: "bg-blue-500" },
    { nome: "Bradesco Saúde", percentagem: 15, quantidade: 187, cor: "bg-amber-500" },
    { nome: "Outros", percentagem: 10, quantidade: 126, cor: "bg-slate-400" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar /> 
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center bg-slate-100 rounded-lg px-4 py-2 w-96 border border-slate-200 focus-within:border-[#0a1128] transition-colors">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar pacientes, consultas..." 
              className="bg-transparent border-none focus:outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-slate-500 hover:text-[#0a1128] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="w-10 h-10 rounded-full bg-[#ADD8E6] text-[#0a1128] flex items-center justify-center font-bold">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Admin MedSync</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-[#F0FFFF]/30 to-[#ADD8E6]/20">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Visão Geral</h2>
            <p className="text-slate-600">Acompanhe os indicadores da clínica hoje.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Consultas Hoje</p>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">12</h3>
              <p className="text-sm text-emerald-600 font-medium mt-2">+2 novos agendamentos</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Retornos Pendentes</p>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ClipboardCopy className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">4</h3>
              <p className="text-sm text-slate-500 font-medium mt-2">Próxima semana</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Total de Pacientes</p>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">1.248</h3>
              <p className="text-sm text-emerald-600 font-medium mt-2">+15 este mês</p>
            </div>

            <div className="bg-[#0a1128] p-6 rounded-2xl shadow-md border border-[#162244] flex flex-col justify-between text-white">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-300 font-medium">Atendimentos</p>
                <div className="p-2 bg-white/10 text-white rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-white">48</h3>
              <p className="text-sm text-slate-300 font-medium mt-2">Mês atual</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Distribuição de Convénios</h3>
                <p className="text-xs text-slate-400 mb-6">Divisão de atendimentos ativos</p>
                
                <div className="space-y-4">
                  {conveniosDistribuicao.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-semibold text-slate-700">
                        <span>{item.nome}</span>
                        <span className="text-slate-400">{item.quantidade} ({item.percentagem}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.cor} rounded-full`} style={{ width: `${item.percentagem}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                <span>Ver relatório detalhado</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Próximos Atendimentos</h3>
                    <p className="text-xs text-slate-400">Consultas agendadas para o bloco atual</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Tarde
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {proximasConsultas.map((consulta) => (
                    <div key={consulta.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center font-bold text-slate-700 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                          {consulta.horario}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{consulta.paciente}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{consulta.tipo} • <span className="text-slate-500">{consulta.modalidade}</span></p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Iniciar Atendimento">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                <span>Visualizar agenda completa</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}