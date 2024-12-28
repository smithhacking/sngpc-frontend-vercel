import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
}

const mockEntradas: EntradaCabecalho[] = [
  {
    id: '1',
    id_fornecedor: '1',
    nome_fornecedor: 'Fornecedor ABC',
    data_entrada: '2024-02-26',
    itens: [
      {
        id: '1',
        produto: 'Medicamento A',
        quantidade: 10,
        lote: 'LOTE123',
      },
    ],
  },
];

const Entradas = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [entradas, setEntradas] = React.useState<EntradaCabecalho[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedEntrada, setSelectedEntrada] = React.useState<EntradaCabecalho | null>(null);
  const [novoItem, setNovoItem] = React.useState<Partial<EntradaItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);
  const [novaEntrada, setNovaEntrada] = React.useState<Partial<EntradaCabecalho>>({});

  React.useEffect(() => {
    const fetchEntradas = async () => {
      if (isMockEnabled) {
        setEntradas(mockEntradas);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/entradas');
        const data = await response.json();
        setEntradas(data);
      } catch (error) {
        console.error('Erro ao buscar entradas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as entradas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, [isMockEnabled, toast]);

  const handleEfetivarEntrada = async (id: string) => {
    if (isMockEnabled) {
      toast({
        title: 'Sucesso',
        description: 'Entrada efetivada com sucesso (Mock)',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/entradas/${id}/efetivar`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Erro ao efetivar entrada');
      
      toast({
        title: 'Sucesso',
        description: 'Entrada efetivada com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível efetivar a entrada',
        variant: 'destructive',
      });
    }
  };

  const handleAdicionarItem = () => {
    if (!selectedEntrada || !novoItem.produto || !novoItem.quantidade || !novoItem.lote) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do item',
        variant: 'destructive',
      });
      return;
    }

    const novoItemCompleto: EntradaItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
    };

    setEntradas(entradas.map(entrada => {
      if (entrada.id === selectedEntrada.id) {
        return {
          ...entrada,
          itens: [...(entrada.itens || []), novoItemCompleto],
        };
      }
      return entrada;
    }));

    setNovoItem({});
    setShowNovoItemDialog(false);
    toast({
      title: 'Sucesso',
      description: 'Item adicionado com sucesso',
    });
  };

  const handleRemoverItem = (entradaId: string, itemId: string) => {
    setEntradas(entradas.map(entrada => {
      if (entrada.id === entradaId) {
        return {
          ...entrada,
          itens: entrada.itens?.filter(item => item.id !== itemId) || [],
        };
      }
      return entrada;
    }));

    toast({
      title: 'Sucesso',
      description: 'Item removido com sucesso',
    });
  };

  const handleSalvarNovaEntrada = () => {
    if (!novaEntrada.nome_fornecedor || !novaEntrada.data_entrada) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const novaEntradaCompleta: EntradaCabecalho = {
      id: Math.random().toString(),
      id_fornecedor: Math.random().toString(),
      nome_fornecedor: novaEntrada.nome_fornecedor,
      data_entrada: novaEntrada.data_entrada,
      itens: [],
    };

    setEntradas([...entradas, novaEntradaCompleta]);
    setNovaEntrada({});
    toast({
      title: 'Sucesso',
      description: 'Entrada criada com sucesso',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Entradas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Nova Entrada</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Nova Entrada</DialogTitle>
              </DialogHeader>
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
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEntrada?.itens?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoverItem(selectedEntrada.id, item.id)}
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            entradas.map((entrada) => (
              <Card key={entrada.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{entrada.nome_fornecedor}</h2>
                    <p className="text-gray-600">Data: {new Date(entrada.data_entrada).toLocaleDateString()}</p>
                  </div>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedEntrada(entrada)}>Ver Itens</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Itens da Entrada</DialogTitle>
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
                              {entrada.itens?.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.produto}</TableCell>
                                  <TableCell>{item.quantidade}</TableCell>
                                  <TableCell>{item.lote}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoverItem(entrada.id, item.id)}
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
                    <Button variant="outline">Editar</Button>
                    <Button variant="destructive">Excluir</Button>
                    <Button
                      variant="outline"
                      className="bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleEfetivarEntrada(entrada.id)}
                    >
                      Efetivar entrada
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Dialog open={showNovoItemDialog} onOpenChange={setShowNovoItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Produto"
                value={novoItem.produto || ''}
                onChange={(e) => setNovoItem({ ...novoItem, produto: e.target.value })}
              />
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
              <Button onClick={handleAdicionarItem}>Adicionar Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Entradas;