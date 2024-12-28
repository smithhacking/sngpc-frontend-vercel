import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMock } from './MockContext';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface RegisterData {
  nome: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { isMockEnabled } = useMock();

  const login = async (email: string, password: string) => {
    if (isMockEnabled) {
      setUser({
        id: '1',
        nome: 'Usuário Teste',
        email: email,
      });
      navigate('/dashboard');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Falha no login');
      }

      const data = await response.json();
      setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (isMockEnabled) {
      setUser({
        id: '1',
        nome: 'Usuário Google',
        email: 'google@example.com',
      });
      navigate('/dashboard');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login/google');
      if (!response.ok) throw new Error('Falha no login com Google');
      
      const data = await response.json();
      setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    if (isMockEnabled) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Falha no registro');
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}