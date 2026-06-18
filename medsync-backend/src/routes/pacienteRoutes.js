const express = require("express");
const router = express.Router();
const PacienteController = require("../controllers/pacienteController");

router.post("/", PacienteController.cadastrarPaciente);
router.get("/", PacienteController.listarPacientes);
router.delete("/:id", PacienteController.deletarPaciente);
router.put("/:id", PacienteController.atualizarPaciente);

module.exports = router;
