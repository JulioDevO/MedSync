const db = require('./src/database/db');
const bcrypt = require('bcryptjs');

async function criarTestes() {
    const senhaHash = await bcrypt.hash('123456', 10);
    
    const usuarios = [
        ['Dr. Especialista', 'medico@medsync.com', '111.111.111-11', senhaHash, 'medico', '123456-SP'],
        ['Paciente Teste', 'paciente@medsync.com', '222.222.222-22', senhaHash, 'paciente', null]
    ];

    for (const u of usuarios) {
        try {
            await db.query(
                "INSERT INTO usuarios (nome, email, cpf, senha, role, crm) VALUES (?, ?, ?, ?, ?, ?)",
                u
            );
            console.log(`✅ Usuário ${u[0]} criado com sucesso!`);
        } catch (e) {
            console.log(`⚠️ Erro ao criar ${u[0]}: ${e.message}`);
        }
    }
    process.exit();
}

criarTestes();