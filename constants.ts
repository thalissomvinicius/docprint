// A4 Dimensions at 300 DPI
export const A4_WIDTH_PX = 2480;
export const A4_HEIGHT_PX = 3508;
export const A4_RATIO = A4_WIDTH_PX / A4_HEIGHT_PX; // ~0.707

// UI Constants
export const MAX_CANVAS_PREVIEW_SIZE = 1200; // Constrain editor canvas for performance
export const SNAPPING_TOLERANCE = 15; // Pixels

export const THEME = {
  primary: '#005DF2',
  background: '#FFFFFF',
  text: '#171717',
};

// Official BCB Series IDs (SGS)
// IGPM: 189, IPCA: 433, INPC: 188, INCC-M: 192, SELIC: 4390, CDI: 4391, TR: 226
export const ECONOMIC_INDICES: any[] = [
  {
    id: 'IGPM',
    name: 'IGP-M',
    fullName: 'Índice Geral de Preços - Mercado',
    description: 'Usado amplamente para reajuste de aluguéis e tarifas públicas.',
    bcbSeriesId: 189
  },
  {
    id: 'IPCA',
    name: 'IPCA',
    fullName: 'Índice Nacional de Preços ao Consumidor Amplo',
    description: 'Indicador oficial da inflação no Brasil (Meta de Inflação).',
    bcbSeriesId: 433
  },
  {
    id: 'INPC',
    name: 'INPC',
    fullName: 'Índice Nacional de Preços ao Consumidor',
    description: 'Mede a variação de custo de vida para famílias com renda de 1 a 5 salários.',
    bcbSeriesId: 188
  },
  {
    id: 'INCC',
    name: 'INCC-M',
    fullName: 'Índice Nacional de Custo da Construção',
    description: 'Utilizado para correção de parcelas de imóveis comprados na planta.',
    bcbSeriesId: 192
  },
  {
    id: 'SELIC',
    name: 'Taxa Selic',
    fullName: 'Taxa Selic (Acumulada no Mês)',
    description: 'Taxa básica de juros da economia brasileira.',
    bcbSeriesId: 4390
  },
  {
    id: 'CDI',
    name: 'CDI',
    fullName: 'Taxa CDI (Acumulada no Mês)',
    description: 'Principal referência de rentabilidade para investimentos de renda fixa.',
    bcbSeriesId: 4391
  },
  {
    id: 'TR',
    name: 'TR',
    fullName: 'Taxa Referencial',
    description: 'Utilizada na correção da Poupança, FGTS e alguns financiamentos imobiliários.',
    bcbSeriesId: 226
  }
];

// Placeholder for initial state, will be replaced by API data
export const AVAILABLE_MONTHS = [];