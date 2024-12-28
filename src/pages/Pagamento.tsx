import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Empresa {
  id: string;
  razao_social: string;
  cnpj: string;
}

const mockEmpresas: Empresa[] = [
  {
    id: '1',
    razao_social: 'Empresa A',
    cnpj: '12.345.678/0001-90',
  },
  {
    id: '2',
    razao_social: 'Empresa B',
    cnpj: '98.765.432/0001-10',
  },
];

const Pagamento = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

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

  const handlePagamento = async () => {
    if (!selectedEmpresa) {
      toast({
        title: 'Erro',
        description: 'Selecione uma empresa para continuar.',
        variant: 'destructive',
      });
      return;
    }

    if (isMockEnabled) {
      toast({
        title: 'Sucesso',
        description: 'Pagamento realizado com sucesso (Mock)',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/pagamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa_id: selectedEmpresa,
        }),
      });

      if (!response.ok) throw new Error('Erro ao processar pagamento');

      toast({
        title: 'Sucesso',
        description: 'Pagamento realizado com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível processar o pagamento.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Pagamento de Mensalidade</h1>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecione a Empresa</label>
              <Select
                value={selectedEmpresa}
                onValueChange={setSelectedEmpresa}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.razao_social} - {empresa.cnpj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handlePagamento}
                className="w-full"
                disabled={!selectedEmpresa}
              >
                Realizar Pagamento
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Pagamento;