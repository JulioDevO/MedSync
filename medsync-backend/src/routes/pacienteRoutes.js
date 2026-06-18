const express = require("express");
const router = express.Router();
const PacienteController = require("../controllers/pacienteController");

router.post("/", PacienteController.cadastrarPaciente);
router.get("/", PacienteController.listarPacientes);

module.exports = router;
