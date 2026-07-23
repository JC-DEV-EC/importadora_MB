import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import { ToastProvider } from "./components/ui/Toast";
import type { ReactNode } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientList = lazy(() => import("./pages/ClientList"));
const ClientDetail = lazy(() => import("./pages/ClientDetail"));
const ClientForm = lazy(() => import("./pages/ClientForm"));
const Cobranza = lazy(() => import("./pages/Cobranza"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Notificaciones = lazy(() => import("./pages/Notificaciones"));
const Reportes = lazy(() => import("./pages/Reportes"));
const AdminUsuarios = lazy(() => import("./pages/AdminUsuarios"));
const Auditoria = lazy(() => import("./pages/Auditoria"));
const Configuracion = lazy(() => import("./pages/Configuracion"));
const Plantillas = lazy(() => import("./pages/Plantillas"));

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-mb-500 border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Suspense fallback={<PageLoading />}><Dashboard /></Suspense>} />
        <Route path="/clients" element={<Suspense fallback={<PageLoading />}><ClientList /></Suspense>} />
        <Route path="/clients/new" element={<Suspense fallback={<PageLoading />}><ClientForm /></Suspense>} />
        <Route path="/clients/:id" element={<Suspense fallback={<PageLoading />}><ClientDetail /></Suspense>} />
        <Route path="/clients/:id/edit" element={<Suspense fallback={<PageLoading />}><ClientForm /></Suspense>} />
        <Route path="/notificaciones" element={<Suspense fallback={<PageLoading />}><Notificaciones /></Suspense>} />
        <Route path="/plantillas" element={<Suspense fallback={<PageLoading />}><Plantillas /></Suspense>} />
        <Route path="/calendario" element={<Suspense fallback={<PageLoading />}><Calendario /></Suspense>} />
        <Route path="/cobranza" element={<Suspense fallback={<PageLoading />}><Cobranza /></Suspense>} />
        <Route path="/reportes" element={<Suspense fallback={<PageLoading />}><Reportes /></Suspense>} />
        <Route path="/admin/usuarios" element={<Suspense fallback={<PageLoading />}><AdminUsuarios /></Suspense>} />
        <Route path="/auditoria" element={<Suspense fallback={<PageLoading />}><Auditoria /></Suspense>} />
        <Route path="/configuracion" element={<Suspense fallback={<PageLoading />}><Configuracion /></Suspense>} />
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
