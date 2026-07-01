const express = require("express");
const router = express.Router();
const AgendamentoController = require("../controllers/agendamentoController"); // Verifique se este arquivo existe e tem essas funções
const { verificarToken, verificarPermissao } = require("../middleware/authMiddleware");

console.log("Controller:", AgendamentoController);
console.log("Token:", verificarToken);
console.log("Permissao:", verificarPermissao);

// GET - Todos os logados podem ver (o filtro no front cuidará da privacidade visual)
router.get("/", verificarToken, AgendamentoController.listarAgendamentos);

// POST - Apenas Admin ou Médico podem criar agendamento
router.post("/", verificarToken, verificarPermissao("admin", "medico"), AgendamentoController.criarAgendamento);

// PATCH - Apenas Admin (Recepcionista) pode alterar status
router.patch("/:id/status", verificarToken, verificarPermissao("admin"), AgendamentoController.atualizarStatus);

// PUT - Apenas Admin ou Médico podem editar
router.put("/:id", verificarToken, verificarPermissao("admin", "medico"), AgendamentoController.editarAgendamento);

module.exports = router;