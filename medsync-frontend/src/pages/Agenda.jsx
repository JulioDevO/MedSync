import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Plus, ChevronLeft, ChevronRight, Clock, MapPin, 
  LayoutList, CalendarDays, Video, Calendar as CalendarIcon, X, Bell,
  CheckCircle, XCircle, Pencil
} from "lucide-react";

import { format, addDays, subDays, startOfWeek, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pt-BR", ptBR); 

// NOVA IMPORTAÇÃO: O componente de pesquisa inteligente
import Select from "react-select";
import { useAuth } from "../context/AuthContext";

export default function Agenda() {
  const [visaoAtual, setVisaoAtual] = useState("lista"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentosIniciais, setAgendamentosIniciais] = useState([]);
  const [dataReferencia, setDataReferencia] = useState(new Date());

  // NOVO ESTADO: Guardar os pacientes que vêm da base de dados
  const [pacientesCadastrados, setPacientesCadastrados] = useState([]);

  const [idEdicao, setIdEdicao] = useState(null);

  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState("");
  const [modalidade, setModalidade] = useState("");
  const { user, role, token } = useAuth();

  // NOVA FUNÇÃO: Ir buscar a lista de pacientes
  const buscarPacientes = async () => {
    try {
      const resposta = await fetch("http://localhost:3333/api/pacientes");
      if (resposta.ok) {
        setPacientesCadastrados(await resposta.json());
      }
    } catch (erro) {
      console.error("Erro ao buscar pacientes:", erro);
    }
  };

  const buscarAgendamentos = async () => {
    try {
      const resposta = await fetch("http://localhost:3333/api/agendamentos");
      if (resposta.ok) {
        setAgendamentosIniciais(await resposta.json());
      }
    } catch (erro) {
      console.error("Erro ao buscar agendamentos:", erro);
    }
  };

  // Carrega tudo ao abrir a página
  useEffect(() => {
    const buscarAgendamentos = async () => {
      try {
        // Trava de segurança: se não houver token, não faz a requisição
        if (!token) return;

        // Criamos a configuração com o token
        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };

        // Passamos o 'config' como segundo parâmetro
        const response = await fetch("http://localhost:3333/api/agendamentos", config);
        
        if (response.ok) {
          const data = await response.json();
          setAgendamentosIniciais(data); // ou o nome do estado que você usa
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      }
    };

    buscarAgendamentos();
  }, [token]); // Não esqueça de colocar o token no array de dependências

  const fecharModal = () => {
    setIsModalOpen(false);
    setPaciente("");
    setData("");
    setHorario("");
    setTipo("");
    setModalidade("");
    setIdEdicao(null); 
  };

  const abrirModalEdicao = (agendamento) => {
    const original = agendamentosIniciais.find(a => a.id === agendamento.id);
    if (!original) return;

    setIdEdicao(original.id);
    setPaciente(original.paciente);
    setData(original.data.split('T')[0]); 
    setHorario(original.horario.substring(0, 5)); 
    setTipo(original.tipo);
    setModalidade(original.modalidade);
    setIsModalOpen(true);
  };

  const handleAtualizarStatus = async (id, novoStatus) => {
    try {
      const resposta = await fetch(`http://localhost:3333/api/agendamentos/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
      });

      if (resposta.ok) {
        buscarAgendamentos(); 
      } else {
        alert("Erro ao atualizar o status do agendamento.");
      }
    } catch (erro) {
      console.error("Erro na comunicação com a API:", erro);
    }
  };

  // --- MOTOR DO CALENDÁRIO ---
  const inicioDaSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 });
  const diasDaSemana = Array.from({ length: 7 }).map((_, i) => addDays(inicioDaSemana, i));
  const fimDaSemana = addDays(inicioDaSemana, 6);
  const textoPeriodo = `${format(inicioDaSemana, "dd", { locale: ptBR })} - ${format(fimDaSemana, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`;

  // 1. AQUI VOCÊ CRIA A LISTA FILTRADA
  const agendamentosFiltrados = role === 'paciente' 
    ? agendamentosIniciais.filter(ag => ag.paciente === user.nome) 
    : agendamentosIniciais;

  const agendamentosDaSemana = diasDaSemana.map(dia => {
    // 2. AQUI VOCÊ MUDA PARA USAR A LISTA FILTRADA
    const consultasDoDia = agendamentosFiltrados.filter(ag => { 
      const dataAg = parseISO(ag.data.split('T')[0]); 
      return isSameDay(dataAg, dia);
    }).map(ag => {
      // ... (seu código de estilo continua igual daqui para baixo)
      const statusAtual = ag.status || "Confirmado";
      
      let style = { cor: "bg-emerald-500", bgCard: "bg-emerald-50", borderCard: "border-emerald-100", textCor: "text-emerald-700" };
      
      if (statusAtual === "Cancelado") {
        style = { cor: "bg-rose-500", bgCard: "bg-rose-50", borderCard: "border-rose-100", textCor: "text-rose-700" };
      } else if (statusAtual === "Realizado") {
        style = { cor: "bg-indigo-500", bgCard: "bg-indigo-50", borderCard: "border-indigo-100", textCor: "text-indigo-700" };
      }

      return {
        id: ag.id,
        paciente: ag.paciente,
        horario: ag.horario.substring(0, 5),
        tipo: ag.tipo,
        modalidade: ag.modalidade,
        status: statusAtual,
        ...style
      };
    }).sort((a, b) => a.horario.localeCompare(b.horario));

    return {
      dataExata: dia,
      dataFormatada: format(dia, "EEEE, dd 'de' MMMM", { locale: ptBR }), 
      nomeDiaCurto: format(dia, "EEE", { locale: ptBR }), 
      diaMes: format(dia, "dd", { locale: ptBR }), 
      consultas: consultasDoDia
    };
  });

  const diasComConsultaNaLista = agendamentosDaSemana.filter(d => d.consultas.length > 0);

  const handleSalvarAgendamento = async (e) => {
    e.preventDefault();
    
    if (role === 'medico') {
        alert("Acesso negado: Médicos não podem alterar a agenda.");
        return;
    }

    // Validação extra para garantir que escolheu um paciente
    if (!paciente) {
      alert("Por favor, selecione um paciente da lista.");
      return;
    }

    const agendamentoDados = { paciente, data, horario, tipo, modalidade };

    const url = idEdicao 
      ? `http://localhost:3333/api/agendamentos/${idEdicao}` 
      : "http://localhost:3333/api/agendamentos";
    
    const metodoHttp = idEdicao ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodoHttp,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoDados)
      });
      const dadosDoBackend = await resposta.json();

      if (resposta.ok) {
        fecharModal();
        buscarAgendamentos(); 
      } else {
        alert(`Erro: ${dadosDoBackend.erro}`);
      }
    } catch (erro) {
      alert("Erro de conexão com o servidor!");
    }
  };

  // TRADUTOR: Preparando os dados para o formato que o react-select exige
  const opcoesDePacientes = pacientesCadastrados.map(p => ({
    value: p.nome,
    label: p.nome // Poderíamos colocar "p.nome - CPF" aqui se quiséssemos!
  }));

  // Estilização customizada para o react-select combinar com o Tailwind
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0.15rem',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#60a5fa' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(96, 165, 250, 0.5)' : 'none',
      '&:hover': { borderColor: '#94a3b8' }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#0a1128' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#334155',
      cursor: 'pointer'
    })
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
            <p className="text-sm text-slate-500 mt-0.5">Gerencie os compromissos e horários da clínica.</p>
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
          
          <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex-1 flex justify-start items-center">
              <button onClick={() => setDataReferencia(subDays(dataReferencia, 7))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 border border-transparent hover:border-slate-200">
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button onClick={() => setDataReferencia(new Date())} className="flex items-center px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-semibold border border-transparent hover:border-slate-200 mx-1">
                <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />Hoje
              </button>
              
              <button onClick={() => setDataReferencia(addDays(dataReferencia, 7))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 border border-transparent hover:border-slate-200">
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="h-6 w-px bg-slate-200 mx-4"></div>
              
              <div className="relative cursor-pointer group custom-datepicker-container z-50">
                <DatePicker
                  selected={dataReferencia}
                  onChange={(date) => setDataReferencia(date)}
                  locale="pt-BR"
                  dateFormat="dd 'de' MMMM 'de' yyyy"
                  customInput={
                    <button className="text-slate-600 font-semibold text-sm hover:text-[#0a1128] bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all border border-slate-200/60 capitalize flex items-center shadow-sm">
                      <CalendarIcon className="w-3.5 h-3.5 mr-2 text-slate-400 group-hover:text-[#0a1128]" />
                      {textoPeriodo}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
                <button onClick={() => setVisaoAtual("lista")} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${visaoAtual === "lista" ? "bg-white text-[#0a1128] shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}><LayoutList className="w-4 h-4 mr-2" />Em Lista</button>
                <button onClick={() => setVisaoAtual("semanal")} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${visaoAtual === "semanal" ? "bg-white text-[#0a1128] shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}><CalendarDays className="w-4 h-4 mr-2" />Semanal</button>
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center pr-2">
              {(role === 'admin' || role === 'paciente') && (
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="flex items-center bg-[#0a1128] text-white px-5 py-2.5 rounded-xl hover:bg-[#162244] transition-colors shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-5 h-5 mr-2" /> {role === 'paciente' ? "Solicitar Consulta" : "Novo Agendamento"}
                </button>
              )}
            </div>
          </div>

          {visaoAtual === "lista" && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              {diasComConsultaNaLista.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <CalendarDays className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>Nenhum agendamento marcado para esta semana.</p>
                </div>
              ) : (
                diasComConsultaNaLista.map((dia) => (
                  <div key={dia.dataFormatada} className="mb-10 last:mb-0">
                    <div className="flex items-center mb-6">
                      <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm border border-slate-200/60 capitalize">
                        {dia.dataFormatada}
                      </div>
                      <div className="flex-1 h-px bg-slate-100 ml-4"></div>
                    </div>
                    <div className="space-y-8">
                      {dia.consultas.map((agendamento) => (
                        <div key={agendamento.id} className="relative flex items-start gap-6 group">
                          <div className="flex flex-col items-center h-full">
                            <div className="text-sm font-bold text-slate-700 w-12 text-right">{agendamento.horario}</div>
                            <div className={`w-3 h-3 rounded-full ${agendamento.cor} mt-2 ring-4 ring-white relative z-10`}></div>
                            <div className="absolute top-8 bottom-[-2rem] left-[3.4rem] w-px bg-slate-200 group-last:hidden"></div>
                          </div>
                          <div className={`flex-1 rounded-2xl p-5 border ${agendamento.bgCard} ${agendamento.borderCard} transition-all hover:shadow-md cursor-pointer`}>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className={`text-lg font-bold ${agendamento.textCor}`}>{agendamento.paciente}</h3>
                                <p className={`text-sm font-medium ${agendamento.textCor} opacity-80`}>{agendamento.tipo}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/60 ${agendamento.textCor}`}>{agendamento.status}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                              <div className={`flex items-center text-sm font-medium ${agendamento.textCor} opacity-70`}><Clock className="w-4 h-4 mr-1.5" />45 min</div>
                              <div className={`flex items-center text-sm font-medium ${agendamento.textCor} opacity-70`}>{agendamento.modalidade === "Online" ? <><Video className="w-4 h-4 mr-1.5" /> Google Meet</> : <><MapPin className="w-4 h-4 mr-1.5" /> Consultório</>}</div>
                            </div>
                            
                            {/* Bloco protegido: apenas admin vê os botões de ação */}
                            {role === 'admin' && agendamento.status === "Confirmado" && (
                              <div className="flex gap-4 mt-5 pt-4 border-t border-slate-200/40">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleAtualizarStatus(agendamento.id, "Realizado"); }}
                                  className="flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1.5" /> Marcar como Realizado
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleAtualizarStatus(agendamento.id, "Cancelado"); }}
                                  className="flex items-center text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-1.5" /> Cancelar Agendamento
                                </button>
                                
                                <button 
                                  onClick={(e) => { e.stopPropagation(); abrirModalEdicao(agendamento); }}
                                  className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors ml-auto border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg bg-white shadow-sm"
                                >
                                  <Pencil className="w-3 h-3 mr-1.5 text-slate-400" /> Editar / Reagendar
                                </button>
                              </div>
                            )}

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {visaoAtual === "semanal" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {agendamentosDaSemana.map((dia) => (
                  <div key={dia.dataFormatada} className="p-4 text-center border-r last:border-r-0 border-slate-100 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{dia.nomeDiaCurto}</span>
                    <span className="text-lg font-bold text-slate-700 mt-1">{dia.diaMes}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 min-h-[600px] bg-slate-50/30">
                {agendamentosDaSemana.map((dia) => (
                  <div key={dia.dataFormatada} className="border-r border-slate-100 p-2 flex flex-col gap-3">
                    {dia.consultas.map((consulta) => (
                      <div key={consulta.id} className={`${consulta.bgCard} border ${consulta.borderCard} rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative group`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-xs font-bold ${consulta.textCor}`}>{consulta.horario}</p>
                          
                          {/* Botão Editar protegido */}
                          {role === 'admin' && consulta.status === "Confirmado" && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); abrirModalEdicao(consulta); }} 
                              className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                              title="Editar / Reagendar"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <p className="text-sm font-bold text-slate-800 leading-tight">{consulta.paciente}</p>
                        <p className={`text-xs ${consulta.textCor} mt-1 flex items-center opacity-80`}>
                          {consulta.modalidade === "Online" ? <Video className="w-3 h-3 mr-1"/> : <MapPin className="w-3 h-3 mr-1"/>}
                          {consulta.modalidade}
                        </p>

                        {/* Botões de Ação protegidos */}
                        {role === 'admin' && consulta.status === "Confirmado" && (
                          <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200/40">
                            <button onClick={(e) => { e.stopPropagation(); handleAtualizarStatus(consulta.id, "Realizado"); }} className="text-indigo-600 hover:text-indigo-800 transition-colors" title="Realizado"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleAtualizarStatus(consulta.id, "Cancelado"); }} className="text-rose-600 hover:text-rose-800 transition-colors" title="Cancelar"><XCircle className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  {idEdicao ? "Editar Agendamento" : "Novo Agendamento"}
                </h3>
                <button onClick={fecharModal} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSalvarAgendamento} className="p-6 space-y-4">
                
                {/* CAMPO ATUALIZADO: O Select Inteligente */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Paciente</label>
                  <Select
                    options={opcoesDePacientes}
                    placeholder="Selecione ou digite o nome..."
                    noOptionsMessage={() => "Nenhum paciente encontrado"}
                    styles={selectStyles}
                    value={opcoesDePacientes.find(op => op.value === paciente) || null}
                    onChange={(opcao) => setPaciente(opcao ? opcao.value : "")}
                    isClearable={true}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                    <input required type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                    <input required type="time" value={horario} onChange={(e) => setHorario(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Consulta</label>
                    <select required value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="">Selecione...</option>
                      <option value="Consulta Inicial">Consulta Inicial</option>
                      <option value="Retorno">Retorno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Modalidade</label>
                    <select required value={modalidade} onChange={(e) => setModalidade(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="">Selecione...</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Online">Online (Telemedicina)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-100">
                  <button type="button" onClick={fecharModal} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0a1128] text-white font-medium hover:bg-[#162244] rounded-xl shadow-sm transition-colors">
                    {idEdicao ? "Salvar Alterações" : "Confirmar Agenda"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}