import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL } from '@/config/api';
import { useQuery } from '@tanstack/react-query';

interface Produto {
  id: string;
  gtin: string;
  registroMs: string;
  nome: string;
  quantidade: number;
  apresentacao: string;
  classeTerapeutica: string;
}

interface ProdutoSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (produto: Produto) => void;
}

const ProdutoSearchModal = ({ isOpen, onClose, onSelect }: ProdutoSearchModalProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: produtos, isLoading } = useQuery({
    queryKey: ['produtos', searchTerm],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/produtos/search?term=${searchTerm}`);
      return response.json();
    },
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Consulta de Produtos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Pesquisar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GTIN</TableHead>
                <TableHead>Registro MS</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Apresentação</TableHead>
                <TableHead>Classe Terapêutica</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : produtos?.map((produto: Produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.gtin}</TableCell>
                  <TableCell>{produto.registroMs}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.quantidade}</TableCell>
                  <TableCell>{produto.apresentacao}</TableCell>
                  <TableCell>{produto.classeTerapeutica}</TableCell>
                  <TableCell>
                    <Button onClick={() => onSelect(produto)}>Selecionar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoSearchModal;