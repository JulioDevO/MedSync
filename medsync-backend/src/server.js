const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const pacienteRoutes = require("./routes/pacienteRoutes");
const agendamentoRoutes = require("./routes/agendamentoRoutes");
const prontuarioRoutes = require("./routes/prontuarioRoutes"); 
const usuarioRoutes = require('../src/routes/usuarioRoutes');
const authRoutes = require("./routes/authRoutes");
const chatController = require('./controllers/chatControllerGemini');

const app = express(); // <--- A inicialização deve vir ANTES de usar o 'app'

app.use(cors());
app.use(express.json());

// Agora, com o 'app' criado, definimos as rotas
app.post('/api/chat', chatController.processarMensagem);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/prontuarios", prontuarioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use("/api", authRoutes);
app.post('/api/chat', chatController.processarMensagem);

app.get("/api/status", (req, res) => {
  return res.json({
    status: "online",
    mensagem: "Bem-vindo à API do MedSync!",
    versao: "1.0.0",
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor MedSync a rodar na porta ${PORT}`);
  console.log(`Aceda a: http://localhost:${PORT}/api/status`);
});
