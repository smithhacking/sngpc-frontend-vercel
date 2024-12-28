import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useMock } from '@/contexts/MockContext';

const Transmitir = () => {
  const { toast } = useToast();
  const { isMockEnabled } = useMock();
  const [dataInicial, setDataInicial] = React.useState('');
  const [dataFinal, setDataFinal] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleTransmitir = async () => {
    if (!dataInicial || !dataFinal) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha as datas inicial e final.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    if (isMockEnabled) {
      setTimeout(() => {
        toast({
          title: 'Sucesso',
          description: 'Arquivo transmitido com sucesso (Mock)',
        });
        setLoading(false);
      }, 2000);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/transmitir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_inicial: dataInicial,
          data_final: dataFinal,
        }),
      });

      if (!response.ok) throw new Error('Erro ao transmitir arquivo');

      toast({
        title: 'Sucesso',
        description: 'Arquivo transmitido com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível transmitir o arquivo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transmitir arquivo SNGPC</h1>
        <Card className="p-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Data Inicial</label>
              <Input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data Final</label>
              <Input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTransmitir}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Transmitindo...' : 'Transmitir arquivo'}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Transmitir;