const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.processarMensagem = async (req, res) => {
    try {
        const { mensagem } = req.body;
        
        // Agora usando o modelo exato liberado no seu terminal
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // O prompt define a "personalidade" e o conhecimento da IA
        const prompt = `Você é o assistente virtual da clínica MedSync. 
        Responda de forma educada, humana e bem direta (máximo de 2 parágrafos). 
        Informações da clínica: 
        - Endereço: Rua Principal, 123, Centro - Campina Grande - PB. 
        - Horário: Atendemos de segunda a sexta, das 8h às 18h.
        - Agendamentos: Diga para o paciente usar a aba 'Agenda' no menu lateral do sistema.
        - Urgências: Oriente a procurar o hospital mais próximo.
        
        Mensagem do paciente: ${mensagem}`;

        const result = await model.generateContent(prompt);
        const resposta = result.response.text();

        res.json({ resposta });
    } catch (error) {
        console.error("Erro na IA:", error);
        res.status(500).json({ resposta: "Desculpe, estou passando por uma atualização técnica no momento." });
    }
};