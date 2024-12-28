import React from 'react';
import Layout from '@/components/Layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';

interface EstoqueItem {
  id: string;
  descricao: string;
  ean: string;
  registro_ms: string;
  quantidade: number;
  lote: string;
  data_fabricacao: string;
  data_vencimento: string;
}

const mockEstoque: EstoqueItem[] = [
  {
    id: '1',
    descricao: 'Medicamento A',
    ean: '7891234567890',
    registro_ms: '1234567890123',
    quantidade: 100,
    lote: 'LOTE123',
    data_fabricacao: '2024-01-01',
    data_vencimento: '2025-01-01',
  },
  {
    id: '2',
    descricao: 'Medicamento B',
    ean: '7891234567891',
    registro_ms: '1234567890124',
    quantidade: 50,
    lote: 'LOTE456',
    data_fabricacao: '2024-02-01',
    data_vencimento: '2025-02-01',
  },
];

const RelatorioEstoque = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [estoque, setEstoque] = React.useState<EstoqueItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEstoque = async () => {
      if (isMockEnabled) {
        setEstoque(mockEstoque);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/estoque');
        const data = await response.json();
        setEstoque(data);
      } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o estoque.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEstoque();
  }, [isMockEnabled, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Estoque Atual</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>EAN</TableHead>
                <TableHead>Registro MS</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Data de Fabricação</TableHead>
                <TableHead>Data de Vencimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estoque.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.ean}</TableCell>
                  <TableCell>{item.registro_ms}</TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{item.lote}</TableCell>
                  <TableCell>{formatDate(item.data_fabricacao)}</TableCell>
                  <TableCell>{formatDate(item.data_vencimento)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default RelatorioEstoque;