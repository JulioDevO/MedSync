import { useState, useEffect } from 'react';
import { 
  CalendarDays, ClipboardCopy, Users, LayoutDashboard,
  Bell, Clock, ArrowUpRight, CheckCircle2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom'; // <-- Importando o navegador do React

export default function Dashboard() {
  const navigate = useNavigate(); // <-- Iniciando o navegador
  
  const { user, role, token } = useAuth();

  // Estados para os dados
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  
  // NOVO ESTADO: Controle do Modal de Relatório
  const [isModalRelatorioOpen, setIsModalRelatorioOpen] = useState(false);

  

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!token) return;

        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };

        const [resPacientes, resAgendamentos] = await Promise.all([
          fetch("http://localhost:3333/api/pacientes", config),
          fetch("http://localhost:3333/api/agendamentos", config)
        ]);

        if (resPacientes.ok) setPacientes(await resPacientes.json());
        if (resAgendamentos.ok) setAgendamentos(await resAgendamentos.json());
        
      } catch (error) {
        console.error("Erro ao buscar dados do Dashboard:", error);
      }
    };
    
    carregarDados();
  }, [token]); // <-- O React vai rodar isso de novo assim que o token carregar


  // --- INTELIGÊNCIA DE DADOS ---
  const dataAtual = new Date();
  const hojeIso = new Date(dataAtual.getTime() - (dataAtual.getTimezoneOffset() * 60000)).toISOString().split('T')[0]; 
  const mesAtual = hojeIso.substring(0, 7); 

  const totalPacientes = pacientes.length;
  const consultasHoje = agendamentos.filter(ag => ag.data.startsWith(hojeIso));
  const qtdConsultasHoje = consultasHoje.length;

  const retornosPendentes = agendamentos.filter(ag => 
    ag.tipo === "Retorno" && (!ag.status || ag.status === "Confirmado")
  ).length;

  const atendimentosMes = agendamentos.filter(ag => 
    ag.data.startsWith(mesAtual) && ag.status === "Realizado"
  ).length;

  const proximasConsultasDinâmicas = consultasHoje
    .filter(ag => !ag.status || ag.status === "Confirmado")
    .sort((a, b) => a.horario.localeCompare(b.horario))
    .slice(0, 5);

  const contagemConvenios = {};
  pacientes.forEach(p => {
    const conv = p.convenio || "Particular"; 
    contagemConvenios[conv] = (contagemConvenios[conv] || 0) + 1;
  });

  const paletaCores = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-slate-400"];
  
  const conveniosDistribuicaoDinamico = Object.keys(contagemConvenios).map((nome, index) => {
    const quantidade = contagemConvenios[nome];
    const percentagem = totalPacientes === 0 ? 0 : Math.round((quantidade / totalPacientes) * 100);
    return {
      nome,
      quantidade,
      percentagem,
      cor: paletaCores[index % paletaCores.length]
    };
  }).sort((a, b) => b.quantidade - a.quantidade); 

  // --- FUNÇÃO PARA NAVEGAR PARA O PRONTUÁRIO ---
  const handleIrParaProntuario = (pacienteNome) => {
    // Navega para a tela de prontuários (podemos passar o nome do paciente depois se quisermos)
    navigate('/prontuarios');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar /> 
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
            <p className="text-sm text-slate-500 mt-0.5">Acompanhe os indicadores da clínica hoje.</p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-slate-500 hover:text-[#0a1128] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
              <div className="w-10 h-10 rounded-full bg-[#ADD8E6] text-[#0a1128] flex items-center justify-center font-bold">AD</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Admin MedSync</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-[#F0FFFF]/30 to-[#ADD8E6]/20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Consultas Hoje</p>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CalendarDays className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{qtdConsultasHoje}</h3>
              <p className="text-sm text-blue-600 font-medium mt-2">Agendamentos ativos</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Retornos Pendentes</p>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ClipboardCopy className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{retornosPendentes}</h3>
              <p className="text-sm text-slate-500 font-medium mt-2">Aguardando atendimento</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-500 font-medium">Total de Pacientes</p>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{totalPacientes}</h3>
              <p className="text-sm text-emerald-600 font-medium mt-2">Na base de dados</p>
            </div>

            <div className="bg-[#0a1128] p-6 rounded-2xl shadow-md border border-[#162244] flex flex-col justify-between text-white">
              <div className="flex items-start justify-between mb-4">
                <p className="text-slate-300 font-medium">Atendimentos</p>
                <div className="p-2 bg-white/10 text-white rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
              </div>
              <h3 className="text-3xl font-bold text-white">{atendimentosMes}</h3>
              <p className="text-sm text-slate-300 font-medium mt-2">Realizados no mês</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Distribuição de Convênios</h3>
                <p className="text-xs text-slate-400 mb-6">Divisão de pacientes ativos</p>
                
                <div className="space-y-4">
                  {conveniosDistribuicaoDinamico.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Nenhum paciente cadastrado.</p>
                  ) : (
                    conveniosDistribuicaoDinamico.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-semibold text-slate-700">
                          <span>{item.nome}</span>
                          <span className="text-slate-400">{item.quantidade} ({item.percentagem}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.cor} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.percentagem}%` }}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* BOTÃO ABRIR MODAL */}
              <button 
                onClick={() => setIsModalRelatorioOpen(true)}
                className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors w-full"
              >
                <span>Ver relatório detalhado</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Próximos Atendimentos</h3>
                    <p className="text-xs text-slate-400">Consultas agendadas para o dia de hoje</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Hoje
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {proximasConsultasDinâmicas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                      <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">Nenhum agendamento pendente para hoje.</p>
                    </div>
                  ) : (
                    proximasConsultasDinâmicas.map((consulta) => (
                      <div key={consulta.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center font-bold text-slate-700 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                            {consulta.horario.substring(0,5)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{consulta.paciente}</h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{consulta.tipo} • <span className="text-slate-500">{consulta.modalidade}</span></p>
                          </div>
                        </div>
                        
                        {/* BOTÃO NAVEGAR PARA PRONTUÁRIO */}
                        {(role === 'admin' || role === 'medico') && (
                          <button onClick={() => navigate('/prontuarios')} className="text-slate-400 hover:text-blue-600...">
                            <ArrowUpRight className="w-5 h-5" /> 
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MODAL DO RELATÓRIO DE CONVÊNIOS */}
        {isModalRelatorioOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Relatório de Convênios</h3>
                <button onClick={() => setIsModalRelatorioOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                  <span>Convênio</span>
                  <span>Pacientes Ativos</span>
                </div>
                
                <div className="space-y-3">
                  {conveniosDistribuicaoDinamico.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.cor} mr-3`}></div>
                        <span className="font-semibold text-slate-700">{item.nome}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800 block">{item.quantidade}</span>
                        <span className="text-xs font-medium text-slate-500">{item.percentagem}% do total</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center px-2">
                    <span className="font-bold text-slate-600">Total Geral</span>
                    <span className="font-bold text-xl text-[#0a1128]">{totalPacientes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}