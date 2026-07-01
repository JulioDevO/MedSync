const db = require("../database/db");

//Função 1: Cadastrar (POST)
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
    // CORREÇÃO AQUI: Tratamento específico para CPF duplicado
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        erro: "Este CPF já está cadastrado em outro paciente!" 
      });
    }

    return res.status(400).json({
      erro: "Erro ao cadastrar.",
      detalhes: err.message,
    });
  }
};

//Função 2: Listar (GET)
exports.listarPacientes = async (req, res) => {
  const sql = "SELECT * FROM pacientes";

  try {
    const [pacientes] = await db.query(sql);
    return res.status(200).json(pacientes);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar pacientes no banco de dados.",
      detalhes: err.message,
    });
  }
};

//Função 3: Deletar (DELETE)
exports.deletarPaciente = async (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM pacientes WHERE id = ?";

  try {
    const [resultado] = await db.query(sql, [id]);

    // Pequeno ajuste no nome da propriedade (afectedRows em vez de effectedRows)
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }
    return res
      .status(200)
      .json({ mensagem: "Paciente excluído com sucesso." });
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao excluir paciente do banco de dados.",
      detalhes: err.message,
    });
  }
};

//Função 4: Atualizar (PUT)
exports.atualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, telefone, convenio } = req.body;

  if (!nome || !cpf || !telefone || !convenio) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
  }

  const sql =
    "UPDATE pacientes SET nome = ?, cpf = ?, telefone = ?, convenio = ? WHERE id = ?";

  try {
    const [resultado] = await db.query(sql, [
      nome,
      cpf,
      telefone,
      convenio,
      id,
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }
    return res
      .status(200)
      .json({ mensagem: "Paciente atualizado com sucesso!" });
  } catch (err) {
    // Também adicionei o tratamento de erro aqui, caso tente atualizar para um CPF que já existe
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ erro: "Este CPF já pertence a outro paciente!" });
    }

    return res.status(500).json({
      erro: "Erro ao atualizar paciente.",
      detalhes: err.message,
    });
  }
};