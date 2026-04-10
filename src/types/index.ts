export type Regime = 'Simples Nacional' | 'Regime Normal';
export type OperationType = 'Venda' | 'Compra' | 'Devolução' | 'Remessa' | 'Transferência' | 'Bonificação' | 'Ativo Imobilizado' | 'Uso e Consumo';
export type ClientType = 'Contribuinte' | 'Não Contribuinte' | 'Consumidor Final';

export interface CFOP {
  id?: string;
  code: string;
  description: string;
  explanation: string;
  application: string;
  examples: string;
  type: 'entrada' | 'saida';
  notes: string;
}

export interface NCM {
  id?: string;
  code: string;
  description: string;
  taxNotes: string;
}

export interface CST_CSOSN {
  id?: string;
  code: string;
  description: string;
  regime: Regime;
  usage: string;
  notes: string;
}

export interface SimulationResult {
  cfop: string;
  cst: string;
  taxes: {
    icms?: string;
    ipi?: string;
    pis?: string;
    cofins?: string;
    st?: string;
    difal?: string;
  };
  observations: string[];
  alerts: string[];
}

export interface Simulation {
  id?: string;
  userId: string;
  originUF: string;
  destUF: string;
  regime: Regime;
  operationType: OperationType;
  isEntry: boolean;
  clientType: ClientType;
  ncm?: string;
  result: SimulationResult;
  createdAt: string;
}

export interface KnowledgeArticle {
  id?: string;
  title: string;
  content: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  category: string;
}
