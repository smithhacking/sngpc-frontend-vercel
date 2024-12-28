import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SaidaCardProps {
  saida: SaidaCabecalho;
  onEdit: (saida: SaidaCabecalho) => void;
  onDelete: (id: string) => void;
  onEfetivar: (id: string) => void;
  handleRemoverItem: (saidaId: string, itemId: string) => void;
  setShowNovoItemDialog: (show: boolean) => void;
  setSelectedSaida: (saida: SaidaCabecalho) => void;
}

interface SaidaCabecalho {
  id: string;
  nome_paciente: string;
  cpf_paciente: string;
  nome_medico: string;
  crm: string;
  data_saida: string;
  data_receita?: string;
  numero_receita?: string;
  tipo_receituario?: string;
  conselho_medico?: string;
  itens?: SaidaItem[];
}

interface SaidaItem {
  id: string;
  produto: string;
  quantidade: number;
  lote: string;
}

const SaidaCard = ({
  saida,
  onEdit,
  onDelete,
  onEfetivar,
  handleRemoverItem,
  setShowNovoItemDialog,
  setSelectedSaida
}: SaidaCardProps) => {
  return (
    <Card key={saida.id} className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{saida.nome_paciente}</h2>
          <p className="text-gray-600">CPF: {saida.cpf_paciente}</p>
          <p className="text-gray-600">Médico: {saida.nome_medico} - CRM: {saida.crm}</p>
          <p className="text-gray-600">Data da Saída: {new Date(saida.data_saida).toLocaleDateString()}</p>
          {saida.data_receita && (
            <p className="text-gray-600">Data da Receita: {new Date(saida.data_receita).toLocaleDateString()}</p>
          )}
          {saida.numero_receita && (
            <p className="text-gray-600">Número da Receita: {saida.numero_receita}</p>
          )}
          {saida.tipo_receituario && (
            <p className="text-gray-600">Tipo de Receituário: {saida.tipo_receituario}</p>
          )}
          {saida.conselho_medico && (
            <p className="text-gray-600">Conselho Médico: {saida.conselho_medico}</p>
          )}
        </div>
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedSaida(saida)}>Ver Itens</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Itens da Saída</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="mb-4">
                  <Button onClick={() => setShowNovoItemDialog(true)}>Adicionar Item</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saida.itens?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.produto}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{item.lote}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoverItem(saida.id, item.id)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => onEdit(saida)}>Editar</Button>
          <Button variant="destructive" onClick={() => onDelete(saida.id)}>Excluir</Button>
          <Button
            variant="outline"
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={() => onEfetivar(saida.id)}
          >
            Efetivar saída
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SaidaCard;