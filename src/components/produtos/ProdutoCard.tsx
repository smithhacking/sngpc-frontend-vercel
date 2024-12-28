import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Produto } from '@/types/produto';

interface ProdutoCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
}

const ProdutoCard = ({ produto, onEdit, onDelete }: ProdutoCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{produto.nome}</h2>
          <p className="text-gray-600">{produto.descricao}</p>
          <p className="text-gray-600">Código de Barras: {produto.codigoBarras}</p>
          <p className="text-gray-600">Registro MS: {produto.registroMs}</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => onEdit(produto)}>
            Editar
          </Button>
          <Button variant="destructive" onClick={() => onDelete(produto.id)}>
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProdutoCard;