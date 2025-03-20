
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ApiProvider } from "./context/ApiContext";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CadastroCliente from "./pages/CadastroCliente";
import ClienteDetalhe from "./pages/ClienteDetalhe";
import ClienteDashboard from "./pages/ClienteDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ApiProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <AdminRoutes />
              } />
              <Route path="/cliente" element={<ClienteDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </ApiProvider>
  </QueryClientProvider>
);

// Componente para proteger as rotas administrativas
const AdminRoutes = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  useEffect(() => {
    if (!user || user.tipo !== 'admin') {
      navigate('/admin-login');
    }
  }, [user, navigate]);
  
  if (!user || user.tipo !== 'admin') {
    return null;
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/cadastro" element={<CadastroCliente />} />
      <Route path="/cliente" element={<ClienteDetalhe />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
