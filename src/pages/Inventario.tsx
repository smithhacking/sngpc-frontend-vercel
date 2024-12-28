import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface InventarioCabecalho {
  id: string;
  data_inventario: string;
  motivo: string;
  itens?: InventarioItem[];
}

interface InventarioItem {
  id: string;
  produto: string;
  quantidade: number;
  lote: string;
}

const mockInventarios: InventarioCabecalho[] = [
  {
    id: '1',
    data_inventario: '2024-02-26',
    motivo: 'Inventário anual',
    itens: [
      {
        id: '1',
        produto: 'Medicamento A',
        quantidade: 100,
        lote: 'LOTE123',
      },
      {
        id: '2',
        produto: 'Medicamento B',
        quantidade: 50,
        lote: 'LOTE456',
      },
    ],
  },
  {
    id: '2',
    data_inventario: '2024-02-25',
    motivo: 'Conferência especial',
    itens: [
      {
        id: '3',
        produto: 'Medicamento C',
        quantidade: 75,
        lote: 'LOTE789',
      },
    ],
  },
];

const Inventario = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [inventarios, setInventarios] = React.useState<InventarioCabecalho[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedInventario, setSelectedInventario] = React.useState<InventarioCabecalho | null>(null);
  const [novoItem, setNovoItem] = React.useState<Partial<InventarioItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);
  const [novoInventario, setNovoInventario] = React.useState<Partial<InventarioCabecalho>>({});

  React.useEffect(() => {
    const fetchInventarios = async () => {
      if (isMockEnabled) {
        setInventarios(mockInventarios);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/inventarios');
        const data = await response.json();
        setInventarios(data);
      } catch (error) {
        console.error('Erro ao buscar inventários:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os inventários.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventarios();
  }, [isMockEnabled, toast]);

  const handleEfetivarInventario = async (id: string) => {
    if (isMockEnabled) {
      toast({
        title: 'Sucesso',
        description: 'Inventário efetivado com sucesso (Mock)',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/inventarios/${id}/efetivar`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Erro ao efetivar inventário');
      
      toast({
        title: 'Sucesso',
        description: 'Inventário efetivado com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível efetivar o inventário',
        variant: 'destructive',
      });
    }
  };

  const handleAdicionarItem = () => {
    if (!selectedInventario || !novoItem.produto || !novoItem.quantidade || !novoItem.lote) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do item',
        variant: 'destructive',
      });
      return;
    }

    const novoItemCompleto: InventarioItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
    };

    setInventarios(inventarios.map(inventario => {
      if (inventario.id === selectedInventario.id) {
        return {
          ...inventario,
          itens: [...(inventario.itens || []), novoItemCompleto],
        };
      }
      return inventario;
    }));

    setNovoItem({});
    setShowNovoItemDialog(false);
    toast({
      title: 'Sucesso',
      description: 'Item adicionado com sucesso',
    });
  };

  const handleRemoverItem = (inventarioId: string, itemId: string) => {
    setInventarios(inventarios.map(inventario => {
      if (inventario.id === inventarioId) {
        return {
          ...inventario,
          itens: inventario.itens?.filter(item => item.id !== itemId) || [],
        };
      }
      return inventario;
    }));

    toast({
      title: 'Sucesso',
      description: 'Item removido com sucesso',
    });
  };

  const handleSalvarNovoInventario = () => {
    if (!novoInventario.data_inventario || !novoInventario.motivo) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const novoInventarioCompleto: InventarioCabecalho = {
      id: Math.random().toString(),
      data_inventario: novoInventario.data_inventario,
      motivo: novoInventario.motivo,
      itens: [],
    };

    setInventarios([...inventarios, novoInventarioCompleto]);
    setNovoInventario({});
    toast({
      title: 'Sucesso',
      description: 'Inventário criado com sucesso',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventário</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Inventário</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Novo Inventário</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={novoInventario.data_inventario || ''}
                    onChange={(e) => setNovoInventario({ ...novoInventario, data_inventario: e.target.value })}
                  />
                  <Textarea
                    placeholder="Motivo do inventário"
                    value={novoInventario.motivo || ''}
                    onChange={(e) => setNovoInventario({ ...novoInventario, motivo: e.target.value })}
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
                      {selectedInventario?.itens?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoverItem(selectedInventario.id, item.id)}
                            >
                              Remover
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Button onClick={handleSalvarNovoInventario} className="mt-4">Salvar Inventário</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            inventarios.map((inventario) => (
              <Card key={inventario.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">Inventário {inventario.id}</h2>
                    <p className="text-gray-600">Data: {new Date(inventario.data_inventario).toLocaleDateString()}</p>
                    <p className="text-gray-600">Motivo: {inventario.motivo}</p>
                  </div>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedInventario(inventario)}>Ver Itens</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Itens do Inventário</DialogTitle>
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
                              {inventario.itens?.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.produto}</TableCell>
                                  <TableCell>{item.quantidade}</TableCell>
                                  <TableCell>{item.lote}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoverItem(inventario.id, item.id)}
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
                      onClick={() => handleEfetivarInventario(inventario.id)}
                    >
                      Efetivar inventário
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

export default Inventario;