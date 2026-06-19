const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "medsync",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

const criarTabelas = async () => {
  try {
    // 1. Tabela de Pacientes
    await db.query(
      `CREATE TABLE IF NOT EXISTS pacientes(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        convenio VARCHAR(100)
      )`,
    );
    console.log(
      '✅ Tabela "pacientes" verificada/criada no MySQL com sucesso!',
    );

    // 2. Tabela de Agendamentos
    await db.query(
      `CREATE TABLE IF NOT EXISTS agendamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente VARCHAR(255) NOT NULL,
        data DATE NOT NULL,
        horario TIME NOT NULL,
        tipo VARCHAR(100) NOT NULL,
        modalidade VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Confirmado',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    );
    console.log(
      '✅ Tabela "agendamentos" verificada/criada no MySQL com sucesso!',
    );
  } catch (error) {
    console.error("❌ Erro ao criar tabelas no MySQL:", error.message);
  }
};

criarTabelas();

module.exports = db;
