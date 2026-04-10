import { CFOP, NCM, CST_CSOSN, KnowledgeArticle } from './types';

export const mockCFOPs: CFOP[] = [
  {
    code: '5101',
    description: 'Venda de produção do estabelecimento',
    explanation: 'Venda de produtos fabricados pela própria empresa dentro do estado.',
    application: 'Indústrias vendendo seus próprios produtos.',
    examples: 'Uma fábrica de móveis vendendo uma mesa produzida por ela.',
    type: 'saida',
    notes: 'Gera débito de ICMS e IPI (se houver).'
  },
  {
    code: '5102',
    description: 'Venda de mercadoria adquirida ou recebida de terceiros',
    explanation: 'Venda de produtos comprados para revenda dentro do estado.',
    application: 'Comércios vendendo produtos de fornecedores.',
    examples: 'Uma loja de roupas vendendo uma camiseta que comprou.',
    type: 'saida',
    notes: 'Operação padrão de revenda comercial.'
  },
  {
    code: '6102',
    description: 'Venda de mercadoria adquirida ou recebida de terceiros (Interestadual)',
    explanation: 'Venda de produtos comprados para revenda para outro estado.',
    application: 'Vendas interestaduais de mercadorias para revenda.',
    examples: 'Loja em SP vendendo para cliente no RJ.',
    type: 'saida',
    notes: 'Sujeito a alíquotas interestaduais (7% ou 12%) e DIFAL se for consumidor final.'
  },
  {
    code: '1102',
    description: 'Compra para comercialização',
    explanation: 'Entrada de mercadoria comprada para ser revendida.',
    application: 'Aquisição de estoque de mercadorias.',
    examples: 'Supermercado comprando bebidas do distribuidor.',
    type: 'entrada',
    notes: 'Permite crédito de ICMS no Regime Normal.'
  },
  {
    code: '5910',
    description: 'Remessa em bonificação, doação ou brinde',
    explanation: 'Envio de mercadorias sem cobrança, como presente ou bônus.',
    application: 'Ações de marketing ou fidelização de clientes.',
    examples: 'Enviar 11 itens e cobrar apenas 10 (o 11º é bonificação).',
    type: 'saida',
    notes: 'Geralmente tributado pelo ICMS, mas isento de PIS/COFINS em alguns casos.'
  },
  {
    code: '5405',
    description: 'Venda de mercadoria sujeita ao regime de substituição tributária (Substituído)',
    explanation: 'Venda de produto que já teve o ICMS pago antecipadamente.',
    application: 'Revenda de produtos com ST (bebidas, pneus, autopeças).',
    examples: 'Farmácia vendendo medicamentos.',
    type: 'saida',
    notes: 'Não há destaque de ICMS na nota fiscal.'
  },
  {
    code: '5551',
    description: 'Venda de bem do ativo imobilizado',
    explanation: 'Venda de equipamentos ou veículos usados na operação da empresa.',
    application: 'Descarte ou renovação de ativos fixos.',
    examples: 'Empresa vendendo um computador usado após 3 anos.',
    type: 'saida',
    notes: 'Isento de ICMS após 12 meses de uso. Sujeito a Ganho de Capital.'
  },
  {
    code: '5949',
    description: 'Outra saída de mercadoria não especificada',
    explanation: 'Código genérico para operações que não possuem CFOP específico.',
    application: 'Remessas para conserto, demonstração ou exposições.',
    examples: 'Enviar um equipamento para assistência técnica.',
    type: 'saida',
    notes: 'Sempre descrever detalhadamente a natureza da operação.'
  }
];

export const mockNCMs: NCM[] = [
  {
    code: '61091000',
    description: 'Camisetas ("t-shirts") e camisetas interiores, de malha, de algodão',
    taxNotes: 'IPI: 0%. PIS/COFINS: Alíquotas básicas. ICMS: Alíquota interna do estado.'
  },
  {
    code: '84713012',
    description: 'Máquinas automáticas para processamento de dados, portáteis (Notebooks)',
    taxNotes: 'IPI: 15% (Pode haver redução por Lei de Informática). PIS/COFINS: Alíquotas básicas.'
  },
  {
    code: '85171300',
    description: 'Smartphones (Telefones inteligentes)',
    taxNotes: 'IPI: 15%. Sujeito a Substituição Tributária em diversos estados.'
  },
  {
    code: '22030000',
    description: 'Cervejas de malte',
    taxNotes: 'IPI: 6%. PIS/COFINS: Regime Monofásico. ICMS ST obrigatório.'
  },
  {
    code: '94032000',
    description: 'Móveis de metal',
    taxNotes: 'IPI: 5%. ICMS: Alíquota interna padrão.'
  }
];

export const mockCSTs: CST_CSOSN[] = [
  {
    code: '00',
    description: 'Tributada integralmente',
    regime: 'Regime Normal',
    usage: 'Operações normais com destaque de ICMS.',
    notes: 'Mais comum em vendas de mercadorias tributadas.'
  },
  {
    code: '10',
    description: 'Tributada e com cobrança de ICMS por substituição tributária',
    regime: 'Regime Normal',
    usage: 'Venda de indústria para comércio com retenção de ST.',
    notes: 'Destaque de ICMS próprio e ICMS ST.'
  },
  {
    code: '40',
    description: 'Isenta',
    regime: 'Regime Normal',
    usage: 'Operações onde não há incidência de imposto por lei.',
    notes: 'Exige indicação do dispositivo legal na nota.'
  },
  {
    code: '60',
    description: 'ICMS cobrado anteriormente por substituição tributária',
    regime: 'Regime Normal',
    usage: 'Revenda de mercadoria que já teve ST retida na fonte.',
    notes: 'Não destaca ICMS na nota.'
  },
  {
    code: '101',
    description: 'Tributada pelo Simples Nacional com permissão de crédito',
    regime: 'Simples Nacional',
    usage: 'Venda para outra empresa que irá aproveitar o crédito.',
    notes: 'Deve informar a alíquota de crédito no rodapé da nota.'
  },
  {
    code: '102',
    description: 'Tributada pelo Simples Nacional sem permissão de crédito',
    regime: 'Simples Nacional',
    usage: 'Venda para consumidor final ou empresa que não aproveita crédito.',
    notes: 'CST mais comum para pequenas empresas.'
  },
  {
    code: '500',
    description: 'ICMS cobrado anteriormente por substituição tributária (Simples)',
    regime: 'Simples Nacional',
    usage: 'Revenda de produtos com ST no Simples Nacional.',
    notes: 'Equivalente ao CST 60 do Regime Normal.'
  }
];

export const mockArticles: KnowledgeArticle[] = [
  {
    title: 'Guia Definitivo: Lucro Real vs Lucro Presumido',
    content: 'A escolha do regime tributário é uma das decisões mais críticas para um contador. No Lucro Real, o imposto é calculado sobre o lucro líquido contábil, permitindo o aproveitamento de prejuízos fiscais. No Lucro Presumido, a base de cálculo é uma margem prefixada pela lei (ex: 32% para serviços), o que pode ser vantajoso se a margem real for maior.',
    level: 'Avançado',
    category: 'Regimes Tributários'
  },
  {
    title: 'Como Calcular o ICMS Substituição Tributária (ST)',
    content: 'O cálculo da ST envolve a MVA (Margem de Valor Agregado). A fórmula básica é: (Valor da Mercadoria + IPI + Frete + Outras Despesas) * (1 + MVA). Sobre esse resultado, aplica-se a alíquota interna e subtrai-se o ICMS próprio da operação.',
    level: 'Intermediário',
    category: 'Impostos'
  },
  {
    title: 'O que é o Diferencial de Alíquota (DIFAL)?',
    content: 'O DIFAL é a diferença entre a alíquota interestadual e a alíquota interna do estado de destino. Desde a EC 87/2015, ele é devido em vendas para consumidores finais não contribuintes localizados em outros estados.',
    level: 'Intermediário',
    category: 'Impostos'
  },
  {
    title: 'Retenções na Fonte: PIS, COFINS e CSLL',
    content: 'Em serviços profissionais acima de R$ 215,05, o tomador deve reter 4,65% (PCC) do valor bruto. Isso é uma antecipação do imposto que o prestador pagaria, evitando a sonegação.',
    level: 'Avançado',
    category: 'Retenções'
  },
  {
    title: 'Introdução à Nota Fiscal Eletrônica (NF-e)',
    content: 'A NF-e é um documento digital que substituiu as antigas notas de papel. Ela possui um arquivo XML (validade jurídica) e o DANFE (representação gráfica). Todo contador deve dominar a estrutura do XML para auditoria.',
    level: 'Básico',
    category: 'Documentos'
  },
  {
    title: 'Obrigações Acessórias: O Guia do SPED',
    content: 'O SPED (Sistema Público de Escrituração Digital) unifica a recepção, validação, armazenamento e autenticação de livros e documentos que integram a escrituração contábil e fiscal. Principais módulos: EFD ICMS/IPI, EFD Contribuições, ECD e ECF.',
    level: 'Intermediário',
    category: 'Obrigações'
  },
  {
    title: 'Ética Profissional e Responsabilidade do Contador',
    content: 'O contador possui responsabilidade civil e criminal sobre as informações prestadas. O Código de Ética Profissional do Contador (NBC PG 01) estabelece os deveres, como o sigilo profissional e a atualização constante.',
    level: 'Básico',
    category: 'Carreira'
  },
  {
    title: 'Planejamento Tributário: Elisão vs Evasão',
    content: 'Elisão fiscal é o uso de meios lícitos para reduzir a carga tributária (planejamento). Evasão fiscal é o uso de meios ilícitos (sonegação). Um bom contador foca na elisão, analisando a melhor estrutura societária e operacional.',
    level: 'Avançado',
    category: 'Estratégia'
  },
  {
    title: 'Como ler um Balancete de Verificação',
    content: 'O balancete é a ferramenta diária do contador. Ele deve equilibrar Débitos e Créditos. Através dele, identificamos erros de lançamento antes do fechamento do Balanço Patrimonial.',
    level: 'Básico',
    category: 'Contabilidade'
  }
];
