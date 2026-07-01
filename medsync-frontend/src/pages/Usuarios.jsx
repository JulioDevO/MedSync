import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  UserCog,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Bell,
  Mail,
  Shield,
} from "lucide-react";

// ============================================================
// Usuarios — CRUD exclusivo do admin (seção 3.6 do PDF).
//
// Esta tela só é alcançável por quem tem role "admin", graças
// ao <ProtectedRoute allowedRoles={["admin"]}> em App.jsx — mas
// mesmo assim o backend DEVE validar de novo (ver authMiddleware),
// nunca confie apenas no bloqueio de rota do frontend.
// ============================================================

const ROLES = [
  { value: "paciente", label: "Paciente" },
  { value: "medico", label: "Médico" },
  { value: "admin", label: "Recepcionista" },
];

export default function Usuarios() {
  const { token } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null); // null = criando novo

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("recepcionista");
  const [crm, setCrm] = useState("");

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    try {
      const resposta = await fetch("http://localhost:3333/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resposta.ok) {
        setUsuarios(await resposta.json());
      }
    } catch (erro) {
      console.error("Erro ao buscar usuários:", erro);
    }
  };

  const abrirModalNovo = () => {
    setUsuarioEditando(null);
    setNome("");
    setEmail("");
    setCpf("");
    setSenha("");
    setRole("paciente");
    setIsModalOpen(true);
    setCrm(usuario?.crm || "");
  };

  const abrirModalEdicao = (usuario) => {
    setUsuarioEditando(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
    setCpf(usuario.cpf);
    setSenha(""); // senha nunca vem preenchida na edição
    setRole(usuario.role);
    setCrm(usuario.crm || "");
    setIsModalOpen(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    const payload = { 
        nome, 
        email, 
        cpf, 
        role, 
        crm: role === 'medico' ? crm : null 
    };
    // Só envia senha se foi preenchida (relevante na edição:
    // campo vazio = "não alterar senha")
    if (senha) payload.senha = senha;

    const ehEdicao = !!usuarioEditando;
    const url = ehEdicao
      ? `http://localhost:3333/api/usuarios/${usuarioEditando.id}`
      : "http://localhost:3333/api/usuarios";

    try {
      const resposta = await fetch(url, {
        method: ehEdicao ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (resposta.ok) {
        setIsModalOpen(false);
        buscarUsuarios();
      } else {
        const erro = await resposta.json();
        alert(erro.mensagem || "Erro ao salvar usuário.");
      }
    } catch {
      alert("Erro de conexão com o servidor!");
    }
  };

  const handleExcluir = async (usuario) => {
    const confirmar = window.confirm(
      `Remover o acesso de "${usuario.nome}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmar) return;

    try {
      const resposta = await fetch(
        `http://localhost:3333/api/usuarios/${usuario.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (resposta.ok) {
        buscarUsuarios();
      } else {
        alert("Erro ao remover usuário.");
      }
    } catch {
      alert("Erro de conexão com o servidor!");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
  );

  const corDoRole = {
    admin: "bg-rose-50 text-rose-700 border-rose-100", 
    medico: "bg-blue-50 text-blue-700 border-blue-100",
    paciente: "bg-emerald-50 text-emerald-700 border-emerald-100", 
  };

  const labelDoRole = {
    admin: "Recepcionista",
    medico: "Médico",
    paciente: "Paciente",
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] main-dashboard">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Gerenciamento de Usuários
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Controle de acesso e permissões da equipe.
            </p>
          </div>
          <button className="relative text-slate-500 hover:text-[#0a1128] transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Barra de busca + botão novo */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                />
              </div>
              <button
                onClick={abrirModalNovo}
                className="flex items-center bg-[#0a1128] text-white px-5 py-2.5 rounded-xl hover:bg-[#162244] transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-5 h-5 mr-2" /> Novo Usuário
              </button>
            </div>

            {/* Lista de usuários */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {usuariosFiltrados.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <UserCog className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Nenhum usuário encontrado.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">E-mail</th>
                      <th className="px-6 py-3">Perfil</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr
                        key={usuario.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {usuario.nome.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800">
                              {usuario.nome}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {usuario.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${corDoRole[usuario.role]}`}
                          >
                            <Shield className="w-3 h-3" />
                            {labelDoRole[usuario.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => abrirModalEdicao(usuario)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleExcluir(usuario)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Criar/Editar */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  {usuarioEditando ? "Editar Usuário" : "Novo Usuário"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSalvar} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Ex: Dra. Camila Soares"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                {/* Campo CRM que só aparece para Médico */}
                {role === 'medico' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      CRM <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={role === 'medico'}
                      value={crm}
                      onChange={(e) => setCrm(e.target.value)}
                      className="w-full px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="Ex: 123456-SP"
                    />
                  </div>
                )}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                        placeholder="nome@clinica.com.br"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Senha{" "}
                    {usuarioEditando && (
                      <span className="font-normal text-slate-400">
                        (deixe em branco para manter a atual)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    required={!usuarioEditando}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Perfil de acesso
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((opcao) => (
                      <button
                        key={opcao.value}
                        type="button"
                        onClick={() => setRole(opcao.value)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                          role === opcao.value
                            ? "bg-[#0a1128] text-white border-[#0a1128]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {opcao.label}
                      </button>
                    ))}
                  </div>
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
                    {usuarioEditando ? "Salvar Alterações" : "Criar Usuário"}
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
