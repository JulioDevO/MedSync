import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Plus, Edit2, User, X, Trash2, AlertTriangle } from "lucide-react";

export default function Pacientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const pacientes = [
    { id: 1, nome: "João Silva", cpf: "123.456.789-00", telefone: "(83) 98888-0000", convenio: "Unimed" },
    { id: 2, nome: "Maria Oliveira", cpf: "987.654.321-11", telefone: "(83) 99999-1111", convenio: "Particular" },
  ];

  const handleSalvarPaciente = (e) => {
    e.preventDefault(); 
    setIsModalOpen(false); 
  };

  const confirmarExclusao = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Gestão de Pacientes
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-[#0a1128] text-white px-5 py-2.5 rounded-xl hover:bg-[#162244] transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Paciente
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-[#F0FFFF]/30 to-[#ADD8E6]/20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CPF..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-6 py-4 font-semibold">CPF</th>
                  <th className="px-6 py-4 font-semibold">Telefone</th>
                  <th className="px-6 py-4 font-semibold">Convênio</th>
                  <th className="px-6 py-4 font-semibold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pacientes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.cpf}</td>
                    <td className="px-6 py-4 text-slate-600">{p.telefone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                        {p.convenio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Editar Paciente"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Excluir Paciente"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE CADASTRO/EDIÇÃO */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Formulário de Paciente</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSalvarPaciente} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="Ex: Ana Carolina Silva" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Convênio</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-slate-700">
                    <option value="">Selecione o convênio...</option>
                    <option value="Particular">Particular</option>
                    <option value="Unimed">Unimed</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#0a1128] text-white font-medium hover:bg-[#162244] rounded-xl shadow-sm transition-colors">Salvar Paciente</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE EXCLUSÃO */}
        {isDeleteModalOpen && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Paciente</h3>
              <p className="text-slate-500 mb-6">Tem certeza que deseja excluir este registro? Esta ação não poderá ser desfeita.</p>
              <div className="flex justify-center space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors w-full">Cancelar</button>
                <button onClick={confirmarExclusao} className="px-5 py-2.5 bg-rose-600 text-white font-medium hover:bg-rose-700 rounded-xl shadow-sm transition-colors w-full">Excluir</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}