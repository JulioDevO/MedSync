const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    } else {
    console.log('📦 Conectado ao banco de dados SQLite com sucesso!');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pacientes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT,
            convenio TEXT
        )
    `);
    console.log('✅ Tabela "pacientes" verificada/criada e pronta para uso.');    
});

module.exports = db;