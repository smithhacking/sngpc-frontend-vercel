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

interface PerdaCabecalho {
  id: string;
  data_perda: string;
  motivo: string;
  itens?: PerdaItem[];
}

interface PerdaItem {
  id: string;
  produto: string;
  quantidade: number;
  lote: string;
}

const mockPerdas: PerdaCabecalho[] = [
  {
    id: '1',
    data_perda: '2024-02-26',
    motivo: 'Vencimento',
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

const Perdas = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [perdas, setPerdas] = React.useState<PerdaCabecalho[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPerda, setSelectedPerda] = React.useState<PerdaCabecalho | null>(null);
  const [novoItem, setNovoItem] = React.useState<Partial<PerdaItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);
  const [novaPerda, setNovaPerda] = React.useState<Partial<PerdaCabecalho>>({});

  React.useEffect(() => {
    const fetchPerdas = async () => {
      if (isMockEnabled) {
        setPerdas(mockPerdas);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/perdas');
        const data = await response.json();
        setPerdas(data);
      } catch (error) {
        console.error('Erro ao buscar perdas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as perdas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerdas();
  }, [isMockEnabled, toast]);

  const handleEfetivarPerda = async (id: string) => {
    if (isMockEnabled) {
      toast({
        title: 'Sucesso',
        description: 'Perda efetivada com sucesso (Mock)',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/perdas/${id}/efetivar`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Erro ao efetivar perda');
      
      toast({
        title: 'Sucesso',
        description: 'Perda efetivada com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível efetivar a perda',
        variant: 'destructive',
      });
    }
  };

  const handleAdicionarItem = () => {
    if (!selectedPerda || !novoItem.produto || !novoItem.quantidade || !novoItem.lote) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do item',
        variant: 'destructive',
      });
      return;
    }

    const novoItemCompleto: PerdaItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
    };

    setPerdas(perdas.map(perda => {
      if (perda.id === selectedPerda.id) {
        return {
          ...perda,
          itens: [...(perda.itens || []), novoItemCompleto],
        };
      }
      return perda;
    }));

    setNovoItem({});
    setShowNovoItemDialog(false);
    toast({
      title: 'Sucesso',
      description: 'Item adicionado com sucesso',
    });
  };

  const handleRemoverItem = (perdaId: string, itemId: string) => {
    setPerdas(perdas.map(perda => {
      if (perda.id === perdaId) {
        return {
          ...perda,
          itens: perda.itens?.filter(item => item.id !== itemId) || [],
        };
      }
      return perda;
    }));

    toast({
      title: 'Sucesso',
      description: 'Item removido com sucesso',
    });
  };

  const handleSalvarNovaPerda = () => {
    if (!novaPerda.data_perda || !novaPerda.motivo) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const novaPerdaCompleta: PerdaCabecalho = {
      id: Math.random().toString(),
      data_perda: novaPerda.data_perda,
      motivo: novaPerda.motivo,
      itens: [],
    };

    setPerdas([...perdas, novaPerdaCompleta]);
    setNovaPerda({});
    toast({
      title: 'Sucesso',
      description: 'Perda criada com sucesso',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Perdas</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Nova Perda</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Nova Perda</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={novaPerda.data_perda || ''}
                    onChange={(e) => setNovaPerda({ ...novaPerda, data_perda: e.target.value })}
                  />
                  <Textarea
                    placeholder="Motivo da perda"
                    value={novaPerda.motivo || ''}
                    onChange={(e) => setNovaPerda({ ...novaPerda, motivo: e.target.value })}
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
                      {selectedPerda?.itens?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{item.lote}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoverItem(selectedPerda.id, item.id)}
                            >
                              Remover
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Button onClick={handleSalvarNovaPerda} className="mt-4">Salvar Perda</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            perdas.map((perda) => (
              <Card key={perda.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">Perda {perda.id}</h2>
                    <p className="text-gray-600">Data: {new Date(perda.data_perda).toLocaleDateString()}</p>
                    <p className="text-gray-600">Motivo: {perda.motivo}</p>
                  </div>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedPerda(perda)}>Ver Itens</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Itens da Perda</DialogTitle>
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
                              {perda.itens?.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.produto}</TableCell>
                                  <TableCell>{item.quantidade}</TableCell>
                                  <TableCell>{item.lote}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleRemoverItem(perda.id, item.id)}
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
                      onClick={() => handleEfetivarPerda(perda.id)}
                    >
                      Efetivar perda
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

export default Perdas;