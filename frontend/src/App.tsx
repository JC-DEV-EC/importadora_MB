import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ClientList } from "./pages/ClientList";
import { ClientDetail } from "./pages/ClientDetail";
import { ClientForm } from "./pages/ClientForm";
import { Login } from "./pages/Login";
import { Cobranza } from "./pages/Cobranza";
import { Calendario } from "./pages/Calendario";
import { Notificaciones } from "./pages/Notificaciones";
import { Reportes } from "./pages/Reportes";
import { AdminUsuarios } from "./pages/AdminUsuarios";
import { Auditoria } from "./pages/Auditoria";
import { Configuracion } from "./pages/Configuracion";
import { Plantillas } from "./pages/Plantillas";
import { ToastProvider } from "./components/ui/Toast";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientForm />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/clients/:id/edit" element={<ClientForm />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/plantillas" element={<Plantillas />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/cobranza" element={<Cobranza />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
