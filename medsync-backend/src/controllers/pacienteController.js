const db = require("../database/db");

exports.cadastrarPaciente = async (req, res) => {
  const { nome, cpf, telefone, convenio } = req.body;

  if (!nome || !cpf) {
    return res.status(400).json({ erro: "Nome e CPF são obrigatórios" });
  }

  const sql =
    "INSERT INTO pacientes (nome, cpf, telefone, convenio) VALUES (?, ?, ?, ?)";

  try {
    const [resultado] = await db.query(sql, [nome, cpf, telefone, convenio]);

    res.status(201).json({
      mensagem: "Paciente cadastrado com sucesso",
      pacienteId: resultado.insertId,
    });
  } catch (err) {
    return res.status(400).json({
      erro: "Erro ao cadastrar. Verifique se o CPF já existe.",
      detalhes: err.message,
    });
  }
};
