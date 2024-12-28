import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { useMock } from '@/contexts/MockContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const { isMockEnabled, toggleMock } = useMock();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold">
              FreeSNGPC
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-primary-dark">
                  Cadastros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/empresas">Empresas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/produtos">Produtos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/fornecedores">Fornecedores</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-primary-dark">
                  Movimentação
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/inventario">Inventário</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/entradas">Entradas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/saidas">Saídas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/perdas">Perdas</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-primary-dark">
                  Relatórios
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/relatorio-estoque">Estoque Atual</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-primary-dark">
                  Arquivo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/transmitir">Transmitir arquivo</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-primary-dark">
                  Pagamento
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link to="/pagamento">Realizar Pagamento</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-white text-primary hover:bg-gray-100"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={toggleMock}
              className={`bg-white text-primary hover:bg-gray-100 ${
                isMockEnabled ? 'bg-green-500 text-white hover:bg-green-600' : ''
              }`}
            >
              {isMockEnabled ? 'Mock: ON' : 'Mock: OFF'}
            </Button>
            <Button
              variant="secondary"
              onClick={logout}
              className="bg-white text-primary hover:bg-gray-100"
            >
              Sair
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};

export default Layout;