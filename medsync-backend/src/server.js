const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pacientes", pacienteRoutes);

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
