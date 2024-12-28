import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { API_BASE_URL } from '@/config/api';
import { useQuery } from '@tanstack/react-query';
import ProdutoSearchModal from '@/components/produtos/ProdutoSearchModal';

interface SaidaFormProps {
  novaSaida: Partial<SaidaCabecalho>;
  setNovaSaida: (saida: Partial<SaidaCabecalho>) => void;
  handleSalvarNovaSaida: () => void;
}

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

const tiposReceituario = [
  "Receita Amarela",
  "Receita Azul",
  "Receita Branca",
  "Receita Tipo C1",
  "Receita Tipo C2",
  "Receita à Base de Cannabis",
  "Receita de Uso Emergencial",
  "Receita Veterinária"
];

const conselhosMedicos = ["CRM", "CRMV"];

const SaidaForm = ({ novaSaida, setNovaSaida, handleSalvarNovaSaida }: SaidaFormProps) => {
  const [showProdutoSearch, setShowProdutoSearch] = React.useState(false);
  const [novoItem, setNovoItem] = React.useState<Partial<SaidaItem>>({});
  const [showNovoItemDialog, setShowNovoItemDialog] = React.useState(false);

  const { data: lotes } = useQuery({
    queryKey: ['lotes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/lotes`);
      return response.json();
    },
  });

  const handleAdicionarItem = () => {
    if (!novoItem.produto || !novoItem.quantidade || !novoItem.lote) {
      return;
    }

    const itemCompleto: SaidaItem = {
      id: Math.random().toString(),
      produto: novoItem.produto,
      quantidade: Number(novoItem.quantidade),
      lote: novoItem.lote,
    };

    setNovaSaida({
      ...novaSaida,
      itens: [...(novaSaida.itens || []), itemCompleto],
    });

    setNovoItem({});
    setShowNovoItemDialog(false);
  };

  const handleRemoverItem = (itemId: string) => {
    setNovaSaida({
      ...novaSaida,
      itens: novaSaida.itens?.filter(item => item.id !== itemId),
    });
  };

  const handleProdutoSelect = (produto: any) => {
    setNovoItem({
      ...novoItem,
      produto: produto.nome,
    });
    setShowProdutoSearch(false);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome_paciente">Nome do Paciente</Label>
          <Input
            id="nome_paciente"
            value={novaSaida.nome_paciente || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, nome_paciente: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cpf_paciente">CPF do Paciente</Label>
          <Input
            id="cpf_paciente"
            value={novaSaida.cpf_paciente || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, cpf_paciente: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="nome_medico">Nome do Médico</Label>
          <Input
            id="nome_medico"
            value={novaSaida.nome_medico || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, nome_medico: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="crm">CRM</Label>
          <Input
            id="crm"
            value={novaSaida.crm || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, crm: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="data_saida">Data da Saída</Label>
          <Input
            id="data_saida"
            type="date"
            value={novaSaida.data_saida || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, data_saida: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="data_receita">Data da Receita</Label>
          <Input
            id="data_receita"
            type="date"
            value={novaSaida.data_receita || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, data_receita: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="numero_receita">Número da Receita</Label>
          <Input
            id="numero_receita"
            value={novaSaida.numero_receita || ''}
            onChange={(e) => setNovaSaida({ ...novaSaida, numero_receita: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="tipo_receituario">Tipo de Receituário</Label>
          <Select
            value={novaSaida.tipo_receituario}
            onValueChange={(value) => setNovaSaida({ ...novaSaida, tipo_receituario: value })}
          >
            <SelectTrigger id="tipo_receituario">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposReceituario.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="conselho_medico">Conselho Médico</Label>
          <Select
            value={novaSaida.conselho_medico}
            onValueChange={(value) => setNovaSaida({ ...novaSaida, conselho_medico: value })}
          >
            <SelectTrigger id="conselho_medico">
              <SelectValue placeholder="Selecione o conselho" />
            </SelectTrigger>
            <SelectContent>
              {conselhosMedicos.map((conselho) => (
                <SelectItem key={conselho} value={conselho}>
                  {conselho}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            {novaSaida.itens?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.produto}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.lote}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoverItem(item.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleSalvarNovaSaida} className="mt-4">Salvar Saída</Button>

      <Dialog open={showNovoItemDialog} onOpenChange={setShowNovoItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between gap-2">
              <Input
                placeholder="Produto"
                value={novoItem.produto || ''}
                onChange={(e) => setNovoItem({ ...novoItem, produto: e.target.value })}
              />
              <Button onClick={() => setShowProdutoSearch(true)}>Buscar Produto</Button>
            </div>
            <Input
              type="number"
              placeholder="Quantidade"
              value={novoItem.quantidade || ''}
              onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) })}
            />
            <Select
              value={novoItem.lote}
              onValueChange={(value) => setNovoItem({ ...novoItem, lote: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes?.map((lote: string) => (
                  <SelectItem key={lote} value={lote}>
                    {lote}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdicionarItem}>Adicionar Item</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ProdutoSearchModal
        isOpen={showProdutoSearch}
        onClose={() => setShowProdutoSearch(false)}
        onSelect={handleProdutoSelect}
      />
    </div>
  );
};

export default SaidaForm;