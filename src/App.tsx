import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { MockProvider } from "@/contexts/MockContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Entradas from "./pages/Entradas";
import Saidas from "./pages/Saidas";
import Perdas from "./pages/Perdas";
import Empresas from "./pages/Empresas";
import Transmitir from "./pages/Transmitir";
import Produtos from "./pages/Produtos";
import Fornecedores from "./pages/Fornecedores";
import Inventario from "./pages/Inventario";
import Pagamento from "./pages/Pagamento";
import RelatorioEstoque from "./pages/RelatorioEstoque";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <MockProvider>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/entradas" element={<Entradas />} />
                <Route path="/saidas" element={<Saidas />} />
                <Route path="/perdas" element={<Perdas />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/transmitir" element={<Transmitir />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/fornecedores" element={<Fornecedores />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/relatorio-estoque" element={<RelatorioEstoque />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </MockProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;