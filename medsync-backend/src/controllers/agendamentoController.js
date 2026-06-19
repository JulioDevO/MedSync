const db = require("../database/db");

//Listar (GET)
exports.listarAgendamentos = async (req, res) => {
  try {
    const [agendamentos] = await db.query(
      "SELECT * FROM agendamentos ORDER BY data ASC, horario ASC",
    );
    return res.status(200).json(agendamentos);
  } catch (err) {
    return res
      .status(500)
      .json({ erro: "Erro ao buscar agendamentos", detalhes: err.message });
  }
};

//CRIAR (POST)
exports.criarAgendamento = async (req, res) => {
  const { paciente, data, horario, tipo, modalidade } = req.body;

  if (!paciente || !data || !horario || !tipo || !modalidade) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  const sql = "INSERT INTO agendamentos (paciente, data, horario, tipo, modalidade) VALUES (?, ?, ?, ?, ?)";

  try {
    const [resultado] = await db.query(sql, [
      paciente,
      data,
      horario,
      tipo,
      modalidade,
    ]);
    return res.status(201).json({
      message: "Agendamento criado com sucesso!",
      id: resultado.insertId,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ erro: "Erro ao criar agendamento", detalhes: err.message });
  }
};

// ATUALIZAR STATUS (PATCH)
exports.atualizarStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body; 

  if (!status) {
    return res.status(400).json({ erro: "O novo status é obrigatório." });
  }

  const sql = "UPDATE agendamentos SET status = ? WHERE id = ?";

  try {
    const [resultado] = await db.query(sql, [status, id]);
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Agendamento não encontrado no banco de dados." });
    }

    return res.status(200).json({ mensagem: `Status atualizado para ${status} com sucesso!` });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao atualizar status.", detalhes: err.message });
  }
};

// EDITAR AGENDAMENTO COMPLETO (PUT)
exports.editarAgendamento = async (req, res) => {
  const { id } = req.params;
  const { paciente, data, horario, tipo, modalidade } = req.body;

  // Validação básica
  if (!paciente || !data || !horario || !tipo || !modalidade) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios para edição." });
  }

  const sql = "UPDATE agendamentos SET paciente = ?, data = ?, horario = ?, tipo = ?, modalidade = ? WHERE id = ?";

  try {
    const [resultado] = await db.query(sql, [paciente, data, horario, tipo, modalidade, id]);
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Agendamento não encontrado no banco de dados." });
    }

    return res.status(200).json({ mensagem: "Agendamento atualizado com sucesso!" });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao atualizar agendamento.", detalhes: err.message });
  }
};

