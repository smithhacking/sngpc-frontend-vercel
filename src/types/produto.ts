export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  codigoBarras: string;
  registroMs: string;
  classeTerapeutica: "Antimicrobianos" | "Controle Especial";
  portariaMedicamento: "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "C2" | "C3" | "C4" | "C5" | "AM";
  gtin?: string;
  quantidade?: number;
  apresentacao?: string;
  dataHoraFabricacao?: string;
  dataHoraValidade?: string;
}