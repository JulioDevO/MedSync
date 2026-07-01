import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import {
  Search,
  User,
  Clock,
  FileText,
  Plus,
  Activity,
  Pill,
  Stethoscope,
  X,
  Bell,
  UserCircle,
  Printer,
} from "lucide-react";
import { ProntuarioParaImpressao } from "../components/ProntuarioParaImpressao";
import { useAuth } from "../context/AuthContext";

export default function Prontuarios() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const { user, role, token } = useAuth(); // Adicione o 'token' aqui

  const [historico, setHistorico] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [queixa, setQueixa] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prescricao, setPrescricao] = useState("");

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        if (!token) return; // Trava de segurança

        const config = {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        };

        // Faz a busca da lista de pacientes para a barra lateral
        const response = await fetch("http://localhost:3333/api/pacientes", config);
        
        if (response.ok) {
          const data = await response.json();
          setPacientes(data); // ATENÇÃO: Confirme se o seu estado chama 'setPacientes' mesmo
        }
      } catch (error) {
        console.error("Erro ao carregar a lista lateral de pacientes:", error);
      }
    };

    carregarPacientes();
  }, [token]);

  // ── Lógica de Impressão ─────────────────────────────────────
  // Apenas um estado simples. O portal cuida do resto.
  const [registroParaImprimir, setRegistroParaImprimir] = useState(null);
  const componenteRef = useRef();

  const handleImprimir = (registro) => {
    setRegistroParaImprimir(registro);
    // Aguarda um frame para o React renderizar o portal antes de imprimir
    requestAnimationFrame(() => {
      window.print();
    });
  };
  // ────────────────────────────────────────────────────────────

  const buscarProntuario = async (nomePaciente) => { // O nome da sua função pode ser um pouco diferente
    try {
      // Trava de segurança
      if (!token) return;

      // Montamos o cabeçalho com o token
      const config = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      };

      // Injetamos a config no fetch
      const response = await fetch(`http://localhost:3333/api/prontuarios/${nomePaciente}`, config);
      
      if (response.ok) {
        const data = await response.json();
        setProntuario(data); // ou o estado que estiver a usar
      }
    } catch (error) {
      console.error("Erro ao procurar prontuário:", error);
    }
  };

  const carregarHistorico = async (nome) => {
    try {
      if (!token) return; // Trava de segurança

      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };

      const resposta = await fetch(`http://localhost:3333/api/prontuarios/${encodeURIComponent(nome)}`, config);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setHistorico(dados.sort((a, b) => b.id - a.id));
      }
    } catch (erro) {
      console.error("Erro ao buscar histórico:", erro);
    }
  };

  const handleSelecionarPaciente = (paciente) => {
    setPacienteSelecionado(paciente);
    carregarHistorico(paciente.nome);
  };

  const handleSalvarProntuario = async (e) => {
    e.preventDefault();

    if (role !== 'medico' && role !== 'admin') {
    alert("Acesso negado: Apenas médicos podem registrar evoluções.");
    return;
  }

    const dataAtual = new Date();
    const dataIso = new Date(
      dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    const novoRegistro = {
      paciente: pacienteSelecionado.nome,
      data: dataIso,
      queixa,
      observacoes,
      prescricao,
    };

    try {
      const resposta = await fetch("http://localhost:3333/api/prontuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoRegistro),
      });

      if (resposta.ok) {
        setIsModalOpen(false);
        setQueixa("");
        setObservacoes("");
        setPrescricao("");
        carregarHistorico(pacienteSelecionado.nome);
      } else {
        alert("Erro ao salvar o prontuário.");
      }
    } catch (erro) {
      alert("Erro de conexão com o servidor!");
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    try {
      const [ano, mes, dia] = dataString.split("T")[0].split("-");
      return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Data não formatada";
    }
  };

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.cpf && p.cpf.includes(busca))
  );

  return (
    <>
      {/* ── Dashboard (nunca é escondido na tela, apenas na impressão via CSS) ── */}
      <div className="flex h-screen bg-[#F8FAFC] main-dashboard">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Prontuário Eletrônico
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Histórico clínico e evoluções dos pacientes.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <button className="relative text-slate-500 hover:text-[#0a1128] transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
                <div className="w-10 h-10 rounded-full bg-[#ADD8E6] text-[#0a1128] flex items-center justify-center font-bold">
                  AD
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Admin MedSync
                  </p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Lista de Pacientes */}
            <div className="w-96 bg-white border-r border-slate-200 flex flex-col z-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
              <div className="p-6 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar paciente por nome ou CPF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {pacientesFiltrados.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Nenhum paciente encontrado.</p>
                  </div>
                ) : (
                  pacientesFiltrados.map((paciente) => (
                    <button
                      key={paciente.id}
                      onClick={() => handleSelecionarPaciente(paciente)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        pacienteSelecionado?.id === paciente.id
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-white border-slate-100 hover:border-blue-100 hover:bg-slate-50 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          pacienteSelecionado?.id === paciente.id
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {paciente.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 truncate">
                        <h4
                          className={`font-bold text-sm truncate ${
                            pacienteSelecionado?.id === paciente.id
                              ? "text-blue-900"
                              : "text-slate-800"
                          }`}
                        >
                          {paciente.nome}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {paciente.convenio || "Particular"} · Nasc:{" "}
                          {paciente.dataNascimento
                            ? paciente.dataNascimento
                                .split("-")
                                .reverse()
                                .join("/")
                            : "N/I"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Área Principal de Prontuários */}
            <div className="flex-1 bg-gradient-to-br from-[#F0FFFF]/30 to-[#ADD8E6]/20 overflow-y-auto relative">
              {!pacienteSelecionado ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-20 h-20 mb-4 opacity-20" />
                  <h3 className="text-xl font-bold text-slate-500 mb-2">
                    Nenhum Paciente Selecionado
                  </h3>
                  <p className="text-sm">
                    Busque e selecione um paciente na lista ao lado para acessar
                    o prontuário.
                  </p>
                </div>
              ) : (
                <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Card de cabeçalho do paciente */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-[#0a1128] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                        {pacienteSelecionado.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                          {pacienteSelecionado.nome}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mt-1">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" /> CPF:{" "}
                            {pacienteSelecionado.cpf || "Não informado"}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="flex items-center">
                            <Activity className="w-4 h-4 mr-1" />{" "}
                            {pacienteSelecionado.convenio || "Particular"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(role === 'medico' || role === 'admin') && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center bg-[#0a1128] text-white px-5 py-2.5 rounded-xl hover:bg-[#162244] transition-colors shadow-sm"
                      >
                        <Plus className="w-5 h-5 mr-2" /> Nova Evolução
                      </button>
                    )}
                  </div>

                  {/* Timeline de Registros */}
                  <div className="space-y-6">
                    {historico.length === 0 ? (
                      <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 border-dashed">
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-lg font-bold text-slate-700 mb-1">
                          Prontuário Vazio
                        </h4>
                        <p className="text-slate-500 text-sm">
                          Este paciente ainda não possui nenhum registro clínico.
                        </p>
                      </div>
                    ) : (
                      historico.map((registro, index) => (
                        <div key={registro.id} className="relative pl-8 mb-6">
                          {index !== historico.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-slate-200" />
                          )}
                          <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center ring-1 ring-slate-200">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          </div>

                          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:border-blue-100 transition-colors">
                            {/* Cabeçalho do card */}
                            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-3 flex justify-between items-center">
                              <span className="font-bold text-slate-700 flex items-center capitalize">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                {formatarData(registro.data)}
                              </span>

                              {/* Botão de impressão — chama handleImprimir */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImprimir(registro);
                                }}
                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg cursor-pointer"
                                title="Imprimir Prontuário"
                              >
                                <Printer className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="p-6 space-y-6">
                              {registro.queixa && (
                                <div>
                                  <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                    <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />{" "}
                                    Queixa Principal
                                  </h5>
                                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                    {registro.queixa}
                                  </p>
                                </div>
                              )}

                              {registro.observacoes && (
                                <div>
                                  <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-emerald-500" />{" "}
                                    Observações & Conduta
                                  </h5>
                                  <p className="text-slate-700 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/50 leading-relaxed whitespace-pre-wrap">
                                    {registro.observacoes}
                                  </p>
                                </div>
                              )}

                              {registro.prescricao && (
                                <div>
                                  <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                    <Pill className="w-4 h-4 mr-2 text-amber-500" />{" "}
                                    Prescrição Médica
                                  </h5>
                                  <p className="text-slate-700 bg-amber-50/30 p-4 rounded-xl border border-amber-100/50 font-medium leading-relaxed whitespace-pre-wrap">
                                    {registro.prescricao}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal — Nova Evolução */}
          {isModalOpen && pacienteSelecionado && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Nova Evolução Clínica
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Paciente:{" "}
                      <strong className="text-slate-700">
                        {pacienteSelecionado.nome}
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSalvarProntuario} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />{" "}
                      Queixa Principal / Anamnese
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={queixa}
                      onChange={(e) => setQueixa(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="Descreva os sintomas relatados pelo paciente..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-emerald-500" />{" "}
                      Observações & Conduta
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                      placeholder="Diagnóstico preliminar, exames solicitados e procedimentos realizados..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Pill className="w-4 h-4 mr-2 text-amber-500" /> Prescrição
                      Médica (Opcional)
                    </label>
                    <textarea
                      rows="2"
                      value={prescricao}
                      onChange={(e) => setPrescricao(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      placeholder="Medicamentos, dosagens e recomendações..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0a1128] text-white font-medium hover:bg-[#162244] rounded-xl shadow-sm transition-colors"
                    >
                      Salvar no Histórico
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Portal de Impressão ─────────────────────────────────────
          Renderizado FORA do .main-dashboard via ReactDOM.createPortal.
          Na tela: invisível (#print-portal { display: none } no CSS).
          Na impressão: único elemento visível.
      ─────────────────────────────────────────────────────────── */}
      {pacienteSelecionado && registroParaImprimir && (
        <ProntuarioParaImpressao
          ref={componenteRef}
          paciente={pacienteSelecionado}
          registro={registroParaImprimir}
          formatarData={formatarData}
        />
      )}
    </>
  );
}