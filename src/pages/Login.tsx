import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Login = () => {
  const { login, loginWithGoogle, register } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao sistema SNGPC.',
      });
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao sistema SNGPC.',
      });
    } catch (error) {
      toast({
        title: 'Erro no login com Google',
        description: 'Não foi possível realizar o login com Google.',
        variant: 'destructive',
      });
    }
  };

  const onRegister = async (data: any) => {
    try {
      await register(data);
      setShowRegister(false);
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você já pode fazer login.',
      });
    } catch (error) {
      toast({
        title: 'Erro no cadastro',
        description: 'Não foi possível realizar o cadastro.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-primary-hover">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">SNGPC</h1>
          <p className="text-gray-600 mt-2">Sistema de Controle de Medicamentos</p>
        </div>
        
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          onGoogleLogin={handleGoogleLogin}
        />

        <div className="text-center">
          <Dialog open={showRegister} onOpenChange={setShowRegister}>
            <DialogTrigger asChild>
              <Button variant="link">Criar conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar conta</DialogTitle>
              </DialogHeader>
              <RegisterForm onRegister={onRegister} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
};

export default Login;