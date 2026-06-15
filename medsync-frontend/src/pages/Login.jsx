import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login simulado com sucesso, redirecionando...");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FFFF] to-[#ADD8E6] p-4">
      <div className="w-full max-w-md p-8 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Bem-vindo(a)
          </h2>
          <p className="text-slate-600">Faça login para acessar o MedSync</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 mt-2 bg-[#0a1128] hover:bg-[#162244] text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}
