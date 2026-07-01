// ============================================================
// authMiddleware.js
//
// Duas funções exportadas:
//
//   verificarToken      → valida o JWT, popula req.user
//   verificarPermissao(...roles) → bloqueia se o role de
//                          req.user não estiver na lista
//
// Uso típico numa rota Express:
//
//   const { verificarToken, verificarPermissao } = require("./middleware/authMiddleware");
//
//   // Qualquer usuário autenticado:
//   router.get("/dashboard-resumo", verificarToken, controller.resumo);
//
//   // Só admin:
//   router.delete("/usuarios/:id", verificarToken, verificarPermissao("admin"), controller.excluir);
//
//   // Recepcionista OU admin:
//   router.post("/pacientes", verificarToken, verificarPermissao("recepcionista", "admin"), controller.criar);
//
// AJUSTE NECESSÁRIO: troque process.env.JWT_SECRET pelo nome
// real da sua variável de ambiente, e confira se o payload do
// seu JWT usa exatamente os campos `id` e `role` (ajuste a
// desestruturação em verificarToken se forem nomes diferentes).
// ============================================================

const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não fornecido." });
  }

  // Espera o formato "Bearer <token>"
  const partes = authHeader.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res
      .status(401)
      .json({ mensagem: "Formato de token inválido. Use 'Bearer <token>'." });
  }

  const [, token] = partes;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Anexa os dados do usuário decodificado à requisição.
    // As rotas seguintes (e o verificarPermissao abaixo) usam
    // req.user.role para decidir o que liberar.
    req.user = {
      id: payload.id,
      nome: payload.nome,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(401).json({ mensagem: "Sessão expirada. Faça login novamente." });
    }
    return res.status(401).json({ mensagem: "Token inválido." });
  }
}

// Retorna um middleware configurado com a lista de roles permitidos.
// Deve SEMPRE ser usado depois de verificarToken na cadeia de
// middlewares, já que depende de req.user existir.
function verificarPermissao(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      // Proteção defensiva: se alguém esquecer de colocar
      // verificarToken antes na rota, falha de forma explícita
      // em vez de deixar passar sem checagem nenhuma.
      return res
        .status(500)
        .json({
          mensagem:
            "verificarPermissao usado sem verificarToken antes na cadeia de middlewares.",
        });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para acessar este recurso.",
      });
    }

    next();
  };
}

module.exports = { verificarToken, verificarPermissao };
