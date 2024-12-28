import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import { Produto } from '@/types/produto';
import ProdutoForm from '@/components/produtos/ProdutoForm';
import ProdutoCard from '@/components/produtos/ProdutoCard';

const mockProdutos: Produto[] = [
  {
    id: '1',
    nome: 'Produto Teste',
    descricao: 'Descrição do produto teste',
    codigoBarras: '7891234567890',
    registroMs: '1234567890123',
    classeTerapeutica: 'Antimicrobianos',
    portariaMedicamento: 'AM',
  },
];

const Produtos = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [produtos, setProdutos] = React.useState<Produto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingProduto, setEditingProduto] = React.useState<Produto | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchProdutos = async () => {
      if (isMockEnabled) {
        setProdutos(mockProdutos);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os produtos.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [isMockEnabled, toast]);

  const onSubmit = async (data: Omit<Produto, 'id'>) => {
    try {
      if (editingProduto) {
        const updatedProduto: Produto = {
          ...data,
          id: editingProduto.id,
        };

        if (isMockEnabled) {
          setProdutos(produtos.map(p => 
            p.id === editingProduto.id ? updatedProduto : p
          ));
        } else {
          await fetch(`http://localhost:8080/api/produtos/${editingProduto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso!',
        });
      } else {
        const novoProduto: Produto = {
          ...data,
          id: Math.random().toString(),
        };

        if (isMockEnabled) {
          setProdutos([...produtos, novoProduto]);
        } else {
          await fetch('http://localhost:8080/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Produto cadastrado com sucesso!',
        });
      }
      setShowDialog(false);
      setEditingProduto(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o produto.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (isMockEnabled) {
        setProdutos(produtos.filter(p => p.id !== id));
      } else {
        await fetch(`http://localhost:8080/api/produtos/${id}`, {
          method: 'DELETE',
        });
      }
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o produto.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingProduto(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button>Novo Produto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <ProdutoForm
                onSubmit={onSubmit}
                initialData={editingProduto || undefined}
                buttonLabel={editingProduto ? 'Atualizar' : 'Cadastrar'}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            produtos.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
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

export default Produtos;