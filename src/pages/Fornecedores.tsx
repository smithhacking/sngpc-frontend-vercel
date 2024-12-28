import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import { Fornecedor } from '@/types/fornecedor';
import FornecedorForm from '@/components/fornecedores/FornecedorForm';
import FornecedorCard from '@/components/fornecedores/FornecedorCard';

const mockFornecedores: Fornecedor[] = [
  {
    id: '1',
    nome: 'Fornecedor Teste',
    cnpj: '12345678901234',
    email: 'fornecedor@teste.com',
    telefone: '(11) 1234-5678',
  },
];

const Fornecedores = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [fornecedores, setFornecedores] = React.useState<Fornecedor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingFornecedor, setEditingFornecedor] = React.useState<Fornecedor | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchFornecedores = async () => {
      if (isMockEnabled) {
        setFornecedores(mockFornecedores);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/fornecedores');
        const data = await response.json();
        setFornecedores(data);
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os fornecedores.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, [isMockEnabled, toast]);

  const onSubmit = async (data: Omit<Fornecedor, 'id'>) => {
    try {
      if (editingFornecedor) {
        const updatedFornecedor: Fornecedor = {
          ...data,
          id: editingFornecedor.id,
        };

        if (isMockEnabled) {
          setFornecedores(fornecedores.map(f => 
            f.id === editingFornecedor.id ? updatedFornecedor : f
          ));
        } else {
          await fetch(`http://localhost:8080/api/fornecedores/${editingFornecedor.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Fornecedor atualizado com sucesso!',
        });
      } else {
        const novoFornecedor: Fornecedor = {
          ...data,
          id: Math.random().toString(),
        };

        if (isMockEnabled) {
          setFornecedores([...fornecedores, novoFornecedor]);
        } else {
          await fetch('http://localhost:8080/api/fornecedores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Fornecedor cadastrado com sucesso!',
        });
      }
      setShowDialog(false);
      setEditingFornecedor(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o fornecedor.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (isMockEnabled) {
        setFornecedores(fornecedores.filter(f => f.id !== id));
      } else {
        await fetch(`http://localhost:8080/api/fornecedores/${id}`, {
          method: 'DELETE',
        });
      }
      toast({
        title: 'Sucesso',
        description: 'Fornecedor excluído com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o fornecedor.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Fornecedores</h1>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingFornecedor(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button>Novo Fornecedor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingFornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                </DialogTitle>
              </DialogHeader>
              <FornecedorForm
                onSubmit={onSubmit}
                initialData={editingFornecedor || undefined}
                buttonLabel={editingFornecedor ? 'Atualizar' : 'Cadastrar'}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            fornecedores.map((fornecedor) => (
              <FornecedorCard
                key={fornecedor.id}
                fornecedor={fornecedor}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Fornecedores;