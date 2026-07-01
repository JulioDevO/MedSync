import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
 

export default function ChatBot() {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [mensagens, setMensagens] = useState([
    { remetente: "bot", texto: "Olá! Como posso ajudar você hoje?" }
  ]);

  if (role !== 'paciente') {
    return null;
  }

  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const novaMensagemUsuario = { remetente: "usuario", texto: input };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    const textoParaEnviar = input;
    setInput("");

    try {
      const response = await fetch("http://localhost:3333/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: textoParaEnviar })
      });
      
      const data = await response.json();
      
      setMensagens((prev) => [
        ...prev,
        { remetente: "bot", texto: data.resposta }
      ]);
    } catch (error) {
      console.error("Erro ao falar com o bot:", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#0a1128] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="bg-[#0a1128] text-white p-4 flex justify-between items-center">
            <span className="font-bold">Assistente MedSync</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {mensagens.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm ${msg.remetente === 'bot' ? 'bg-slate-100' : 'bg-blue-600 text-white self-end'}`}>
                {msg.texto}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg p-2 text-sm"
              placeholder="Digite sua dúvida..."
              onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
            />
            <button onClick={enviarMensagem} className="bg-blue-600 text-white p-2 rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}