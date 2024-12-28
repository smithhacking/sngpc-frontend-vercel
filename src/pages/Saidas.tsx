import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import SaidaForm from '@/components/saidas/SaidaForm';
import SaidaCard from '@/components/saidas/SaidaCard';

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

const mockSaidas: SaidaCabecalho[] = [
  {
    id: '1',
    nome_paciente: 'Maria Santos',
    cpf_paciente: '12345678901',
    nome_medico: 'Dr. José Silva',
    crm: '54321',
    data_saida: '2024-02-26',
    data_receita: '2024-02-25',
    numero_receita: '123456',
    tipo_receituario: 'Receita Amarela',
    conselho_medico: 'CRM',
    itens: [
      {
        id: '1',
        produto: 'Medicamento X',
        quantidade: 2,
        lote: 'ABC123',
      },
    ],
  },
];

const Saidas = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [saidas, setSaidas] = React.useState<SaidaCabecalho[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSaida, setSelectedSaida] = React.useState<SaidaCabecalho | null>(null);
  const [novoItem, setNovoItem] = React.useState<Partial<SaidaItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);
  const [novaSaida, setNovaSaida] = React.useState<Partial<SaidaCabecalho>>({});
  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchSaidas = async () => {
      if (isMockEnabled) {
        setSaidas(mockSaidas);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/saidas');
        const data = await response.json();
        setSaidas(data);
      } catch (error) {
        console.error('Erro ao buscar saídas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as saídas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSaidas();
  }, [isMockEnabled, toast]);

  const handleEfetivarSaida = async (id: string) => {
    try {
      if (isMockEnabled) {
        toast({
          title: 'Sucesso',
          description: 'Saída efetivada com sucesso (Mock)',
        });
        return;
      }

      const response = await fetch(`http://localhost:8080/api/saidas/${id}/efetivar`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Erro ao efetivar saída');
      
      toast({
        title: 'Sucesso',
        description: 'Saída efetivada com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível efetivar a saída',
        variant: 'destructive',
      });
    }
  };

  const handleAdicionarItem = () => {
    if (!selectedSaida || !novoItem.produto || !novoItem.quantidade || !novoItem.lote) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos do item',
        variant: 'destructive',
      });
      return;
    }

    const novoItemCompleto: SaidaItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
    };

    setSaidas(saidas.map(saida => {
      if (saida.id === selectedSaida.id) {
        return {
          ...saida,
          itens: [...(saida.itens || []), novoItemCompleto],
        };
      }
      return saida;
    }));

    setNovoItem({});
    setShowNovoItemDialog(false);
    toast({
      title: 'Sucesso',
      description: 'Item adicionado com sucesso',
    });
  };

  const handleRemoverItem = (saidaId: string, itemId: string) => {
    setSaidas(saidas.map(saida => {
      if (saida.id === saidaId) {
        return {
          ...saida,
          itens: saida.itens?.filter(item => item.id !== itemId) || [],
        };
      }
      return saida;
    }));

    toast({
      title: 'Sucesso',
      description: 'Item removido com sucesso',
    });
  };

  const handleSalvarNovaSaida = () => {
    if (!novaSaida.nome_paciente || !novaSaida.cpf_paciente || !novaSaida.nome_medico || !novaSaida.crm || !novaSaida.data_saida) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const novaSaidaCompleta: SaidaCabecalho = {
      id: Math.random().toString(),
      nome_paciente: novaSaida.nome_paciente,
      cpf_paciente: novaSaida.cpf_paciente,
      nome_medico: novaSaida.nome_medico,
      crm: novaSaida.crm,
      data_saida: novaSaida.data_saida,
      data_receita: novaSaida.data_receita,
      numero_receita: novaSaida.numero_receita,
      tipo_receituario: novaSaida.tipo_receituario,
      conselho_medico: novaSaida.conselho_medico,
      itens: [],
    };

    setSaidas([...saidas, novaSaidaCompleta]);
    setNovaSaida({});
    setShowDialog(false);
    toast({
      title: 'Sucesso',
      description: 'Saída criada com sucesso',
    });
  };

  const handleEdit = (saida: SaidaCabecalho) => {
    setNovaSaida(saida);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setSaidas(saidas.filter(saida => saida.id !== id));
    toast({
      title: 'Sucesso',
      description: 'Saída excluída com sucesso',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Saídas</h1>
          <Button onClick={() => setShowDialog(true)}>Nova Saída</Button>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Nova Saída</DialogTitle>
            </DialogHeader>
            <SaidaForm
              novaSaida={novaSaida}
              setNovaSaida={setNovaSaida}
              handleSalvarNovaSaida={handleSalvarNovaSaida}
            />
          </DialogContent>
        </Dialog>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            saidas.map((saida) => (
              <SaidaCard
                key={saida.id}
                saida={saida}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onEfetivar={handleEfetivarSaida}
                handleRemoverItem={handleRemoverItem}
                setShowNovoItemDialog={setShowNovoItemDialog}
                setSelectedSaida={setSelectedSaida}
              />
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

export default Saidas;