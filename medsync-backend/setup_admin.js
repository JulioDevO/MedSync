const db = require('./src/database/db'); // Ajuste o caminho se necessário
const bcrypt = require('bcryptjs');

async function setup() {
    try {
        // 1. Cria a tabela de usuários
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome TEXT NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                cpf VARCHAR(20) NOT NULL,
                senha TEXT NOT NULL,
                role VARCHAR(50) NOT NULL
            )
        `);
        console.log("✅ Tabela 'usuarios' verificada/criada!");

        // 2. Cria o usuário Admin
        const senhaHash = await bcrypt.hash('123456', 10);
        await db.query(
            "INSERT INTO usuarios (nome, email, cpf, senha, role) VALUES (?, ?, ?, ?, ?)",
            ['Administrador', 'admin@medsync.com', '000.000.000-00', senhaHash, 'admin']
        );
        console.log("✅ Administrador criado com sucesso! E-mail: admin@medsync.com | Senha: 123456");

    } catch (err) {
        console.error("❌ Erro ao configurar admin:", err.message);
    } finally {
        process.exit();
    }
}

setup();