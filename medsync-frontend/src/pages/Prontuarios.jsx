import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Search, FileText, ChevronRight, User, 
  History, Pill, Microscope, Plus, Download, Printer 
} from "lucide-react";

export default function Prontuarios() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("historico");

  const pacientes = [
    { id: 1, nome: "João Silva", idade: 45, tipoSanguineo: "O+", ultimaConsulta: "14/05/2026", peso: "78kg", altura: "1.75m", alergias: "Nenhuma" },
    { id: 2, nome: "Maria Oliveira", idade: 32, tipoSanguineo: "A-", ultimaConsulta: "12/05/2026", peso: "62kg", altura: "1.65m", alergias: "Dipirona" },
    { id: 3, nome: "Carlos Mendes", idade: 58, tipoSanguineo: "B+", ultimaConsulta: "15/05/2026", peso: "85kg", altura: "1.80m", alergias: "Frutos do mar" },
  ];

  const handleSelecionarPaciente = (paciente) => {
    setPacienteSelecionado(paciente);
    setAbaAtiva("historico");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">
            Prontuários Eletrônicos
          </h2>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          <div className="w-96 bg-white border-r border-slate-200 flex flex-col z-0">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {pacientes.map((paciente) => (
                <button
                  key={paciente.id}
                  onClick={() => handleSelecionarPaciente(paciente)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 ${
                    pacienteSelecionado?.id === paciente.id 
                      ? "bg-[#0a1128] text-white shadow-md" 
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center text-left">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 font-bold ${
                      pacienteSelecionado?.id === paciente.id ? "bg-white/20" : "bg-blue-50 text-blue-600"
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{paciente.nome}</p>
                      <p className={`text-xs ${pacienteSelecionado?.id === paciente.id ? "text-slate-300" : "text-slate-500"}`}>
                        Última visita: {paciente.ultimaConsulta}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${pacienteSelecionado?.id === paciente.id ? "text-slate-300" : "text-slate-400"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-slate-50 overflow-auto">
            {pacienteSelecionado ? (
              <div className="h-full flex flex-col">
                <div className="bg-white p-8 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner">
                        {pacienteSelecionado.nome.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">{pacienteSelecionado.nome}</h2>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                          <span>{pacienteSelecionado.idade} anos</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-rose-500">Sangue: {pacienteSelecionado.tipoSanguineo}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>Alergias: <strong className={pacienteSelecionado.alergias !== "Nenhuma" ? "text-rose-500" : ""}>{pacienteSelecionado.alergias}</strong></span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir Ficha
                    </button>
                  </div>

                  <div className="flex gap-2 border-b border-slate-100">
                    <button onClick={() => setAbaAtiva("historico")} className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors ${abaAtiva === "historico" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                      <History className="w-4 h-4 mr-2" /> Histórico Clínico
                    </button>
                    <button onClick={() => setAbaAtiva("receitas")} className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors ${abaAtiva === "receitas" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                      <Pill className="w-4 h-4 mr-2" /> Receitas
                    </button>
                    <button onClick={() => setAbaAtiva("exames")} className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors ${abaAtiva === "exames" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}>
                      <Microscope className="w-4 h-4 mr-2" /> Exames
                    </button>
                  </div>
                </div>

                <div className="p-8 flex-1">
                  
                  {abaAtiva === "historico" && (
                    <div className="max-w-3xl animate-in fade-in duration-300">
                      <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Evolução do Paciente</h3>
                        <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 mr-2" /> Nova Evolução
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                          <div className="absolute left-0 top-5 bottom-5 w-1 bg-blue-500 rounded-r-md"></div>
                          <div className="pl-2">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-800">Consulta de Rotina</h4>
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">14/05/2026</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              Paciente compareceu relatando dores de cabeça esporádicas no fim do dia. Pressão arterial aferida: 120/80 mmHg. Peso estável. Recomendada hidratação e pausas durante o uso de telas.
                            </p>
                            <div className="mt-4 flex gap-2">
                              <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-xs font-medium text-slate-500">PA: 120/80</span>
                              <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-xs font-medium text-slate-500">FC: 75 bpm</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === "receitas" && (
                    <div className="max-w-3xl animate-in fade-in duration-300">
                      <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Prescrições Ativas</h3>
                        <button className="flex items-center text-sm font-bold text-white bg-[#0a1128] hover:bg-[#162244] px-4 py-2 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 mr-2" /> Nova Receita
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                              <Pill className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Paracetamol 750mg</h4>
                              <p className="text-sm text-slate-500 mt-1">1 comprimido a cada 8 horas, em caso de dor ou febre.</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-xs font-semibold text-slate-400">Prescrito em 14/05/2026</span>
                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors tooltip" title="Baixar PDF">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === "exames" && (
                    <div className="max-w-3xl animate-in fade-in duration-300">
                      <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Resultados e Pedidos</h3>
                        <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 mr-2" /> Solicitar Exame
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                              <Microscope className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">Hemograma Completo</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Laboratório Central • 12/01/2026</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full">Resultado Pronto</span>
                            <button className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors text-sm font-bold flex items-center">
                              Ver PDF <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 flex-col bg-[#F8FAFC]">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-slate-500">Selecione um paciente na lista para abrir o prontuário.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}