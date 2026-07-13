export type StatusInsumo = 'disponivel' | 'baixo' | 'indisponivel';

export type CategoriaInsumo = 'Papelaria' | 'Laboratório' | 'Arte' | 'Escrita' | 'Outros';

export interface Insumo {
  id: number;
  nome: string;
  categoria: CategoriaInsumo;
  quantidade: number;
  status: StatusInsumo;
  observacao?: string;
  dataAtualizacao: string;
}

export interface LogAtividade {
  id: string;
  itemNome: string;
  tipo: 'adicionado' | 'atualizado' | 'removido' | 'ajuste_estoque';
  descricao: string;
  timestamp: string;
}
