import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Produto } from '@/types/produto';

const produtoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string(),
  codigoBarras: z.string(),
  registroMs: z.string(),
  classeTerapeutica: z.enum(['Antimicrobianos', 'Controle Especial']),
  portariaMedicamento: z.enum(['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5', 'AM']),
});

type ProdutoFormData = z.infer<typeof produtoSchema>;

interface ProdutoFormProps {
  onSubmit: (data: ProdutoFormData) => Promise<void>;
  initialData?: Produto;
  buttonLabel: string;
}

const ProdutoForm = ({ onSubmit, initialData, buttonLabel }: ProdutoFormProps) => {
  const form = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialData || {
      nome: '',
      descricao: '',
      codigoBarras: '',
      registroMs: '',
      classeTerapeutica: 'Antimicrobianos',
      portariaMedicamento: 'AM',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codigoBarras"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Barras</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registroMs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registro MS</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classeTerapeutica"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe Terapêutica</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classe terapêutica" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Antimicrobianos">Antimicrobianos</SelectItem>
                  <SelectItem value="Controle Especial">Controle Especial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portariaMedicamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portaria do Medicamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a portaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'C3', 'C4', 'C5', 'AM'].map((portaria) => (
                    <SelectItem key={portaria} value={portaria}>
                      {portaria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {buttonLabel}
        </Button>
      </form>
    </Form>
  );
};

export default ProdutoForm;