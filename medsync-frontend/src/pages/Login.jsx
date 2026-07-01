import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("http://localhost:3333/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "E-mail ou senha incorretos.");
        setCarregando(false);
        return;
      }

      // dados = { token, user: { role, nome, ... } }
      login(dados);

      // Redireciona para o dashboard — cada perfil já vê
      // um conteúdo diferente lá dentro, então uma rota única
      // de entrada é suficiente.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro("Não foi possível conectar ao servidor. Tente novamente.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Fundo decorativo sutil, ecoando o gradiente usado em Prontuarios.jsx */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0FFFF]/40 to-[#ADD8E6]/20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo + Nome */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#0a1128] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#0a1128]/20">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">MedSync</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sistema de Gestão para Clínicas
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Acesse sua conta
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Entre com suas credenciais de funcionário.
          </p>

          {/* Mensagem de erro */}
          {erro && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@clinica.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {mostrarSenha ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full flex items-center justify-center bg-[#0a1128] text-white font-medium py-3 rounded-xl hover:bg-[#162244] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {carregando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Acesso restrito a funcionários autorizados. <br />
          Em caso de dúvidas, contate o administrador do sistema.
        </p>
      </div>
    </div>
  );
}
