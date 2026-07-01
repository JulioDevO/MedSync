import { createContext, useContext, useState, useEffect } from "react";

// ============================================================
// AuthContext
// Fonte única de verdade sobre quem está logado e qual o papel
// (role) do usuário. Persiste em localStorage para sobreviver
// a refresh de página (F5), e expõe helpers de permissão que
// as telas usam para decidir o que mostrar.
// ============================================================

const AuthContext = createContext(null);

const STORAGE_KEY = "@medsync:auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    // Lê do localStorage na inicialização (sobrevive a F5)
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  // Sempre que `auth` muda, sincroniza com localStorage
  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  // Chamado pela tela de Login após POST /api/login bem-sucedido.
  // Espera exatamente o formato: { token, user: { role, nome, ... } }
  const login = ({ token, user }) => {
    setAuth({ token, user });
  };

  const logout = () => {
    setAuth(null);
  };

  // Helpers de permissão — usados por Sidebar, ProtectedRoute e
  // dentro das próprias telas para esconder botões/seções.
  const role = auth?.user?.role ?? null;
  const isAdmin = role === "admin";
  const isMedico = role === "medico";
  const isRecepcionista = role === "recepcionista";

  // hasAccess(["admin", "medico"]) → true se o role atual está na lista
  const hasAccess = (rolesPermitidos) => {
    if (!role) return false;
    if (!rolesPermitidos || rolesPermitidos.length === 0) return true;
    return rolesPermitidos.includes(role);
  };

  const value = {
    token: auth?.token ?? null,
    user: auth?.user ?? null,
    role,
    isAuthenticated: !!auth?.token,
    isAdmin,
    isMedico,
    isRecepcionista,
    hasAccess,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook de consumo. Lança erro claro se usado fora do Provider —
// evita o bug silencioso clássico de "auth is null" sem explicação.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}
