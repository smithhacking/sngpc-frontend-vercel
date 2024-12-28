import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.nome}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/entradas')}>
            <h2 className="text-xl font-semibold mb-2">Entradas</h2>
            <p className="text-gray-600">Gerencie as entradas de medicamentos</p>
          </Card>
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/saidas')}>
            <h2 className="text-xl font-semibold mb-2">Saídas</h2>
            <p className="text-gray-600">Controle as saídas de medicamentos</p>
          </Card>
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/empresas')}>
            <h2 className="text-xl font-semibold mb-2">Empresas</h2>
            <p className="text-gray-600">Gerencie suas empresas</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;