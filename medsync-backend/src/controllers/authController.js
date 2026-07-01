// src/controllers/authController.js
const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        // Busca o usuário no banco
        const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        
        if (usuarios.length === 0) return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });

        const usuario = usuarios[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });

        // Gera o token
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, role: usuario.role }, 
            process.env.JWT_SECRET || "secreta", // Use uma variável de ambiente!
            { expiresIn: '8h' }
        );

        return res.json({ token, user: { nome: usuario.nome, role: usuario.role } });
    } catch (err) {
        return res.status(500).json({ mensagem: "Erro no servidor." });
    }
};