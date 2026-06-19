const express = require("express");
const router = express.Router();
const AgendamentoController = require("../controllers/agendamentoController");

router.get("/", AgendamentoController.listarAgendamentos);
router.post("/", AgendamentoController.criarAgendamento);
router.patch("/:id/status", AgendamentoController.atualizarStatus);
router.put("/:id", AgendamentoController.editarAgendamento);

module.exports = router;