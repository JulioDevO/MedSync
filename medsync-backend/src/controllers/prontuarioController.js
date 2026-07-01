const db = require("../database/db");

// FUNÇÃO 1: CRIAR NOVA ANOTAÇÃO NO PRONTUÁRIO
exports.criarProntuario = async (req, res) => {
  const { paciente, data, queixa, observacoes, prescricao } = req.body;

  if (!paciente || !data) {
    return res.status(400).json({ erro: "Nome do paciente e data são obrigatórios." });
  }

  const criarTabela = `
    CREATE TABLE IF NOT EXISTS prontuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paciente VARCHAR(255) NOT NULL,
      data DATE NOT NULL,
      queixa TEXT,
      observacoes TEXT,
      prescricao TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const sqlInsert = "INSERT INTO prontuarios (paciente, data, queixa, observacoes, prescricao) VALUES (?, ?, ?, ?, ?)";

  try {
    await db.query(criarTabela); 
    await db.query(sqlInsert, [paciente, data, queixa, observacoes, prescricao]);
    return res.status(201).json({ mensagem: "Prontuário salvo com sucesso!" });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao salvar prontuário.", detalhes: err.message });
  }
};

// FUNÇÃO 2: BUSCAR HISTÓRICO DE UM PACIENTE ESPECÍFICO
exports.listarPorPaciente = async (req, res) => { 
  const { nomePaciente } = req.params;

  const sql = "SELECT * FROM prontuarios WHERE paciente = ? ORDER BY data DESC, created_at DESC";

  try {
    const [linhas] = await db.query(sql, [nomePaciente]);
    return res.status(200).json(linhas);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([]); 
    }
    return res.status(500).json({ erro: "Erro ao buscar histórico." });
  }
};