const express = require("express");
const router = express.Router();
const prontuarioController = require('../controllers/prontuarioController');
const { verificarToken, verificarPermissao } = require('../middleware/authMiddleware');

// Apenas Administradores e Médicos podem criar novos registos
router.post("/", verificarToken, verificarPermissao("admin", "medico"), prontuarioController.criarProntuario);

// Apenas Administradores e Médicos podem consultar o histórico clínico
router.get('/:nomePaciente', verificarToken, verificarPermissao("admin", "medico"), prontuarioController.listarPorPaciente);

module.exports = router;