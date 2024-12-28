import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fornecedor } from '@/types/fornecedor';

interface FornecedorCardProps {
  fornecedor: Fornecedor;
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (id: string) => void;
}

const FornecedorCard = ({ fornecedor, onEdit, onDelete }: FornecedorCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{fornecedor.nome}</h2>
          <p className="text-gray-600">CNPJ: {fornecedor.cnpj}</p>
          <p className="text-gray-600">Email: {fornecedor.email}</p>
          <p className="text-gray-600">Telefone: {fornecedor.telefone}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onEdit(fornecedor)}>
            Editar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(fornecedor.id)}>
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FornecedorCard;