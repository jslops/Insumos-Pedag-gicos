import { Insumo, LogAtividade } from '../types';

export const INITIAL_INSUMOS: Insumo[] = [
  {
    id: 1,
    nome: 'Caderno espiral 10 matérias',
    categoria: 'Papelaria',
    quantidade: 45,
    status: 'disponivel',
    observacao: 'Uso exclusivo para turmas do Ensino Fundamental II.',
    dataAtualizacao: '2026-07-12T14:30:00-03:00'
  },
  {
    id: 2,
    nome: 'Caneta esferográfica preta',
    categoria: 'Escrita',
    quantidade: 120,
    status: 'disponivel',
    observacao: 'Para preenchimento de diários de classe pelos docentes.',
    dataAtualizacao: '2026-07-13T08:15:00-03:00'
  },
  {
    id: 3,
    nome: 'Tinta guache 6 cores (kit)',
    categoria: 'Arte',
    quantidade: 4,
    status: 'baixo',
    observacao: 'Demanda urgente para a feira de ciências infantil.',
    dataAtualizacao: '2026-07-10T10:00:00-03:00'
  },
  {
    id: 4,
    nome: 'Microscópio Monocular 400x',
    categoria: 'Laboratório',
    quantidade: 2,
    status: 'disponivel',
    observacao: 'Guardar no armário climatizado após o término das aulas.',
    dataAtualizacao: '2026-07-11T16:45:00-03:00'
  },
  {
    id: 5,
    nome: 'Papel A4 Sulfite 75g (Resma)',
    categoria: 'Papelaria',
    quantidade: 15,
    status: 'disponivel',
    observacao: 'Utilizado na coordenação para provas bimestrais.',
    dataAtualizacao: '2026-07-13T09:00:00-03:00'
  },
  {
    id: 6,
    nome: 'Giz de cera colorido 12 un',
    categoria: 'Arte',
    quantidade: 0,
    status: 'indisponivel',
    observacao: 'Estoque zerado. Aguardando entrega da distribuidora.',
    dataAtualizacao: '2026-07-09T11:20:00-03:00'
  },
  {
    id: 7,
    nome: 'Lápis de cor aquarelável 24 cores',
    categoria: 'Arte',
    quantidade: 8,
    status: 'baixo',
    observacao: 'Estoque de reposição solicitado pela coordenação de Artes.',
    dataAtualizacao: '2026-07-12T17:00:00-03:00'
  },
  {
    id: 8,
    nome: 'Tubos de ensaio de borossilicato',
    categoria: 'Laboratório',
    quantidade: 35,
    status: 'disponivel',
    observacao: 'Para aulas de química do Ensino Médio.',
    dataAtualizacao: '2026-07-12T09:30:00-03:00'
  }
];

export const INITIAL_LOGS: LogAtividade[] = [
  {
    id: 'l1',
    itemNome: 'Caneta esferográfica preta',
    tipo: 'ajuste_estoque',
    descricao: 'Abastecimento de estoque (+50 unidades) realizado pela Supervisão.',
    timestamp: '2026-07-13T08:15:00-03:00'
  },
  {
    id: 'l2',
    itemNome: 'Papel A4 Sulfite 75g (Resma)',
    tipo: 'adicionado',
    descricao: 'Nova carga de resmas de papel sulfite adicionada para provas.',
    timestamp: '2026-07-13T09:00:00-03:00'
  },
  {
    id: 'l3',
    itemNome: 'Tinta guache 6 cores (kit)',
    tipo: 'atualizado',
    descricao: 'Consumo registrado por professores do infantil (-10 kits).',
    timestamp: '2026-07-12T15:20:00-03:00'
  },
  {
    id: 'l4',
    itemNome: 'Giz de cera colorido 12 un',
    tipo: 'ajuste_estoque',
    descricao: 'Status alterado para indisponível (estoque zerado).',
    timestamp: '2026-07-09T11:20:00-03:00'
  }
];

export const STORAGE_KEYS = {
  INSUMOS: 'gestao_insumos_items',
  LOGS: 'gestao_insumos_logs'
};

export function loadInsumos(): Insumo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INSUMOS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading insumos from localStorage', e);
  }
  return INITIAL_INSUMOS;
}

export function saveInsumos(items: Insumo[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.INSUMOS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving insumos to localStorage', e);
  }
}

export function loadLogs(): LogAtividade[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading logs from localStorage', e);
  }
  return INITIAL_LOGS;
}

export function saveLogs(logs: LogAtividade[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving logs to localStorage', e);
  }
}
