import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// ProtectedRoute
// Wrapper de rota usado dentro de <Route element={<ProtectedRoute .../>}>
// para envolver um grupo de rotas filhas (via <Outlet />).
//
// Duas verificações, nesta ordem:
//   1. Está autenticado? Não → manda pro /login.
//   2. Se `allowedRoles` foi passado, o role do usuário está
//      na lista? Não → manda pro /dashboard com aviso (em vez
//      de tela em branco ou erro confuso).
//
// IMPORTANTE: isto é UX, não segurança. Qualquer pessoa pode
// abrir o DevTools e burlar isto client-side. A segurança real
// vem do middleware no backend (ver authMiddleware.js).
// ============================================================

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Usuário autenticado, mas sem permissão para esta rota específica.
    // Redireciona para o dashboard em vez de deixar a tela quebrada.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
