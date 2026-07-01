const db = require('./src/database/db'); // Ajuste o caminho se necessário

async function atualizarBanco() {
    try {
        // Adiciona a coluna 'crm' permitindo valores nulos (pois paciente e recepcionista não terão)
        await db.query("ALTER TABLE usuarios ADD COLUMN crm VARCHAR(20) NULL;");
        console.log("✅ Coluna 'crm' adicionada com sucesso na tabela de usuários!");
    } catch (err) {
        // Se der erro 1060 (ER_DUP_FIELDNAME), significa que a coluna já existe
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("⚠️ A coluna 'crm' já existe no banco.");
        } else {
            console.error("❌ Erro ao atualizar o banco:", err.message);
        }
    } finally {
        process.exit();
    }
}

atualizarBanco();