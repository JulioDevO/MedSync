// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarPermissao } = require('../middleware/authMiddleware');

// Apenas o Admin pode acessar essas rotas
router.get('/', verificarToken, verificarPermissao('admin'), usuarioController.listar);
router.post('/', verificarToken, verificarPermissao('admin'), usuarioController.criar);
router.delete('/:id', verificarToken, verificarPermissao('admin'), usuarioController.excluir); // <- Linha nova

module.exports = router;