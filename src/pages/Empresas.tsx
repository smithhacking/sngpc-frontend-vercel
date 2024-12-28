import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import InputMask from 'react-input-mask';

interface Empresa {
  id: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

const mockEmpresas: Empresa[] = [
  {
    id: '1',
    razao_social: 'Farmácia Teste Ltda',
    cnpj: '12345678901234',
    email: 'contato@farmaciateste.com',
    telefone: '(11) 1234-5678',
    endereco: 'Rua Teste, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '12345-678',
  },
];

const Empresas = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingEmpresa, setEditingEmpresa] = React.useState<Empresa | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Empresa>>({});

  React.useEffect(() => {
    const fetchEmpresas = async () => {
      if (isMockEnabled) {
        setEmpresas(mockEmpresas);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/empresas');
        const data = await response.json();
        setEmpresas(data);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as empresas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, [isMockEnabled, toast]);

  const handleSubmit = async () => {
    if (!formData.razao_social || !formData.cnpj || !formData.email) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingEmpresa) {
        const updatedEmpresa = {
          ...editingEmpresa,
          ...formData,
        };

        if (isMockEnabled) {
          setEmpresas(empresas.map(emp => 
            emp.id === editingEmpresa.id ? updatedEmpresa : emp
          ));
        } else {
          await fetch(`http://localhost:8080/api/empresas/${editingEmpresa.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Empresa atualizada com sucesso!',
        });
      } else {
        const novaEmpresa: Empresa = {
          ...formData as Empresa,
          id: Math.random().toString(),
        };

        if (isMockEnabled) {
          setEmpresas([...empresas, novaEmpresa]);
        } else {
          await fetch('http://localhost:8080/api/empresas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        }
        toast({
          title: 'Sucesso',
          description: 'Empresa cadastrada com sucesso!',
        });
      }
      setShowDialog(false);
      setEditingEmpresa(null);
      setFormData({});
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar a empresa.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData(empresa);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (isMockEnabled) {
        setEmpresas(empresas.filter(emp => emp.id !== id));
      } else {
        await fetch(`http://localhost:8080/api/empresas/${id}`, {
          method: 'DELETE',
        });
      }
      toast({
        title: 'Sucesso',
        description: 'Empresa excluída com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir a empresa.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Empresas</h1>
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingEmpresa(null);
              setFormData({});
            }
          }}>
            <DialogTrigger asChild>
              <Button>Nova Empresa</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Razão Social</label>
                    <Input
                      value={formData.razao_social || ''}
                      onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CNPJ</label>
                    <InputMask
                      mask="99.999.999/9999-99"
                      value={formData.cnpj || ''}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <InputMask
                      mask="(99) 9999-9999"
                      value={formData.telefone || ''}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Endereço</label>
                    <Input
                      value={formData.endereco || ''}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cidade</label>
                    <Input
                      value={formData.cidade || ''}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estado</label>
                    <Input
                      value={formData.estado || ''}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CEP</label>
                    <InputMask
                      mask="99999-999"
                      value={formData.cep || ''}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    >
                      {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="mt-4">
                  {editingEmpresa ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            empresas.map((empresa) => (
              <Card key={empresa.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{empresa.razao_social}</h2>
                    <p className="text-gray-600">CNPJ: {empresa.cnpj}</p>
                    <p className="text-gray-600">Email: {empresa.email}</p>
                    <p className="text-gray-600">Telefone: {empresa.telefone}</p>
                    <p className="text-gray-600">Endereço: {empresa.endereco}</p>
                    <p className="text-gray-600">Cidade: {empresa.cidade} - {empresa.estado}</p>
                    <p className="text-gray-600">CEP: {empresa.cep}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => handleEdit(empresa)}>
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(empresa.id)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Empresas;