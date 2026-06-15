import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Plus, ChevronLeft, ChevronRight, Clock, MapPin, 
  LayoutList, CalendarDays, Video, Calendar as CalendarIcon, X
} from "lucide-react";

export default function Agenda() {
  const [visaoAtual, setVisaoAtual] = useState("lista"); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const diasAgendados = [
    {
      dataIso: "2026-05-12",
      data: "Terça, 12 de Maio",
      consultas: [
        { id: 2, paciente: "Maria Oliveira", horario: "10:30", tipo: "Retorno de Exames", modalidade: "Online", status: "Pendente", cor: "bg-amber-500", bgCard: "bg-amber-50", borderCard: "border-amber-100", textCor: "text-amber-700" }
      ]
    },
    {
      dataIso: "2026-05-14",
      data: "Quinta, 14 de Maio",
      consultas: [
        { id: 1, paciente: "João Silva", horario: "09:00", tipo: "Consulta Inicial", modalidade: "Presencial", status: "Confirmado", cor: "bg-emerald-500", bgCard: "bg-emerald-50", borderCard: "border-emerald-100", textCor: "text-emerald-700" }
      ]
    },
    {
      dataIso: "2026-05-15",
      data: "Sexta, 15 de Maio",
      consultas: [
        { id: 3, paciente: "Carlos Mendes", horario: "14:00", tipo: "Consulta de Rotina", modalidade: "Presencial", status: "Confirmado", cor: "bg-emerald-500", bgCard: "bg-emerald-50", borderCard: "border-emerald-100", textCor: "text-emerald-700" }
      ]
    }
  ];

  const colunasSemana = [
    { nome: "Segunda", label: "SEG, 11" }, { nome: "Terça", label: "TER, 12" },
    { nome: "Quarta", label: "QUA, 13" }, { nome: "Quinta", label: "QUI, 14" },
    { nome: "Sexta", label: "SEX, 15" }, { nome: "Sábado", label: "SÁB, 16" },
    { nome: "Domingo", label: "DOM, 17" }
  ];

  const handleSalvarAgendamento = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
          
          <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-[#0a1128] text-white px-5 py-2.5 rounded-xl hover:bg-[#162244] transition-colors shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Novo Agendamento
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-[#F0FFFF]/30 to-[#ADD8E6]/20">
          
          <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center">
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 border border-transparent hover:border-slate-200"><ChevronLeft className="w-5 h-5" /></button>
              <button className="flex items-center px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-semibold border border-transparent hover:border-slate-200 mx-1"><CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />Hoje</button>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 border border-transparent hover:border-slate-200"><ChevronRight className="w-5 h-5" /></button>
              <div className="h-6 w-px bg-slate-200 mx-4"></div>
              <span className="text-slate-500 font-medium text-sm">11 - 17 de Maio de 2026</span>
            </div>

            <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
              <button onClick={() => setVisaoAtual("lista")} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${visaoAtual === "lista" ? "bg-white text-[#0a1128] shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}><LayoutList className="w-4 h-4 mr-2" />Em Lista</button>
              <button onClick={() => setVisaoAtual("semanal")} className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all ${visaoAtual === "semanal" ? "bg-white text-[#0a1128] shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}><CalendarDays className="w-4 h-4 mr-2" />Semanal</button>
            </div>
          </div>

          {visaoAtual === "lista" && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              {diasAgendados.map((dia) => (
                <div key={dia.data} className="mb-10 last:mb-0">
                  <div className="flex items-center mb-6">
                    <div className="bg-slate-50 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm border border-slate-200/60">{dia.data}</div>
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
                            <div className={`flex items-center text-sm font-medium ${agendamento.textCor} opacity-70`}>{agendamento.modalidade === "Online" ? <><Video className="w-4 h-4 mr-1.5" /> Google Meet</> : <><MapPin className="w-4 h-4 mr-1.5" /> Consultório 02</>}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {visaoAtual === "semanal" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {colunasSemana.map((coluna) => (
                  <div key={coluna.nome} className="p-4 text-center border-r last:border-r-0 border-slate-100">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{coluna.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 min-h-[600px] bg-slate-50/30">
                {colunasSemana.map((coluna) => {
                  const diaEncontrado = diasAgendados.find(d => d.data.startsWith(coluna.nome));
                  return (
                    <div key={coluna.nome} className="border-r border-slate-100 p-2 flex flex-col gap-3">
                      {diaEncontrado && diaEncontrado.consultas.map((consulta) => (
                        <div key={consulta.id} className={`${consulta.bgCard} border ${consulta.borderCard} rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}>
                          <p className={`text-xs font-bold ${consulta.textCor} mb-1`}>{consulta.horario}</p>
                          <p className="text-sm font-bold text-slate-800 leading-tight">{consulta.paciente}</p>
                          <p className={`text-xs ${consulta.textCor} mt-1 flex items-center opacity-80`}>
                            {consulta.modalidade === "Online" ? <Video className="w-3 h-3 mr-1"/> : <MapPin className="w-3 h-3 mr-1"/>}
                            {consulta.modalidade}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Novo Agendamento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSalvarAgendamento} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Paciente</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ex: Ana Carolina" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                    <input type="date" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                    <input type="time" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Consulta</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="">Selecione...</option>
                      <option value="Consulta Inicial">Consulta Inicial</option>
                      <option value="Retorno">Retorno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Modalidade</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="">Selecione...</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Online">Online (Telemedicina)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0a1128] text-white font-medium hover:bg-[#162244] rounded-xl shadow-sm transition-colors">Confirmar Agenda</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}