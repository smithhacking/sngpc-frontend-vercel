import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProdutoSearchModal from '@/components/produtos/ProdutoSearchModal';

interface EntradaFormProps {
  novaEntrada: Partial<EntradaCabecalho>;
  setNovaEntrada: (entrada: Partial<EntradaCabecalho>) => void;
  handleSalvarNovaEntrada: () => void;
}

interface EntradaCabecalho {
  id: string;
  id_fornecedor: string;
  nome_fornecedor: string;
  data_entrada: string;
  itens?: EntradaItem[];
}

interface EntradaItem {
  id: string;
  produto: string;
  quantidade: number;
  lote: string;
  dataHoraFabricacao: string;
  dataHoraValidade: string;
}

const EntradaForm = ({ novaEntrada, setNovaEntrada, handleSalvarNovaEntrada }: EntradaFormProps) => {
  const [showProdutoSearch, setShowProdutoSearch] = React.useState(false);
  const [novoItem, setNovoItem] = React.useState<Partial<EntradaItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);

  const handleAdicionarItem = () => {
    if (!novoItem.produto || !novoItem.quantidade || !novoItem.lote || !novoItem.dataHoraFabricacao || !novoItem.dataHoraValidade) {
      return;
    }

    const itemCompleto: EntradaItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
      dataHoraFabricacao: novoItem.dataHoraFabricacao,
      dataHoraValidade: novoItem.dataHoraValidade,
    };

    setNovaEntrada({
      ...novaEntrada,
      itens: [...(novaEntrada.itens || []), itemCompleto],
    });

    setNovoItem({});
    setShowNovoItemDialog(false);
  };

  const handleRemoverItem = (itemId: string) => {
    setNovaEntrada({
      ...novaEntrada,
      itens: novaEntrada.itens?.filter(item => item.id !== itemId),
    });
  };

  const handleProdutoSelect = (produto: any) => {
    setNovoItem({
      ...novoItem,
      produto: produto.nome,
    });
    setShowProdutoSearch(false);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Nome do Fornecedor"
          value={novaEntrada.nome_fornecedor || ''}
          onChange={(e) => setNovaEntrada({ ...novaEntrada, nome_fornecedor: e.target.value })}
        />
        <Input
          type="date"
          value={novaEntrada.data_entrada || ''}
          onChange={(e) => setNovaEntrada({ ...novaEntrada, data_entrada: e.target.value })}
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Itens</h3>
          <Button onClick={() => setShowNovoItemDialog(true)}>Adicionar Item</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Data Fabricação</TableHead>
              <TableHead>Data Validade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {novaEntrada.itens?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.produto}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.lote}</TableCell>
                <TableCell>{new Date(item.dataHoraFabricacao).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.dataHoraValidade).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoverItem(item.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleSalvarNovaEntrada} className="mt-4">Salvar Entrada</Button>

      <Dialog open={showNovoItemDialog} onOpenChange={setShowNovoItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between gap-2">
              <Input
                placeholder="Produto"
                value={novoItem.produto || ''}
                onChange={(e) => setNovoItem({ ...novoItem, produto: e.target.value })}
              />
              <Button onClick={() => setShowProdutoSearch(true)}>Buscar Produto</Button>
            </div>
            <Input
              type="number"
              placeholder="Quantidade"
              value={novoItem.quantidade || ''}
              onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) })}
            />
            <Input
              placeholder="Lote"
              value={novoItem.lote || ''}
              onChange={(e) => setNovoItem({ ...novoItem, lote: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Data de Fabricação"
              value={novoItem.dataHoraFabricacao || ''}
              onChange={(e) => setNovoItem({ ...novoItem, dataHoraFabricacao: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Data de Validade"
              value={novoItem.dataHoraValidade || ''}
              onChange={(e) => setNovoItem({ ...novoItem, dataHoraValidade: e.target.value })}
            />
            <Button onClick={handleAdicionarItem}>Adicionar Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ProdutoSearchModal
        isOpen={showProdutoSearch}
        onClose={() => setShowProdutoSearch(false)}
        onSelect={handleProdutoSelect}
      />
    </div>
  );
};

export default EntradaForm;