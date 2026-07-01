// src/controllers/usuarioController.js
const db = require('../database/db');
const bcrypt = require('bcryptjs');

const listar = async (req, res) => {
    try {
        // Busca todos os usuários, mas não retorna as senhas por segurança
        const [usuarios] = await db.query(
            "SELECT id, nome, email, cpf, role, crm FROM usuarios ORDER BY nome ASC"
        );
        return res.json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        return res.status(500).json({ mensagem: "Erro ao buscar usuários." });
    }
};

const criar = async (req, res) => {
    // 1. Adicione o crm aqui na desestruturação
    const { nome, email, cpf, senha, role, crm } = req.body;

    if (!nome || !email || !cpf || !senha || !role) {
        return res.status(400).json({ mensagem: "Todos os campos base são obrigatórios." });
    }

    // 2. Nova trava de segurança para o Médico
    if (role === 'medico' && !crm) {
        return res.status(400).json({ mensagem: "O número do CRM é obrigatório para médicos." });
    }

    try {
        const [emailExiste] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (emailExiste.length > 0) return res.status(400).json({ mensagem: "Este e-mail já está em uso." });

        const senhaHash = await bcrypt.hash(senha, 10);

        // 3. Atualize o INSERT para incluir o crm (se não tiver, vai como nulo)
        await db.query(
            "INSERT INTO usuarios (nome, email, cpf, senha, role, crm) VALUES (?, ?, ?, ?, ?, ?)",
            [nome, email, cpf, senhaHash, role, crm || null]
        );

        return res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao criar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao criar usuário." });
    }
};

// Como o seu frontend também tem a função de excluir, vou adicionar ela aqui já!
const excluir = async (req, res) => {
    const { id } = req.params;
    
    // Proteção: não deixar o admin excluir a si mesmo acidentalmente
    if (req.user.id == id) {
        return res.status(400).json({ mensagem: "Você não pode excluir a si mesmo." });
    }

    try {
        await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
        return res.json({ mensagem: "Usuário excluído com sucesso!" });
    } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        return res.status(500).json({ mensagem: "Erro ao excluir usuário." });
    }
};

module.exports = { listar, criar, excluir };