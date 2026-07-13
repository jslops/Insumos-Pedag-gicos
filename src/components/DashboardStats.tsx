import { Insumo } from '../types';
import { Layers, CheckCircle2, AlertTriangle, Tag, Boxes, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardStatsProps {
  items: Insumo[];
}

export default function DashboardStats({ items }: DashboardStatsProps) {
  const totalDistinct = items.length;
  const totalPhysicalUnits = items.reduce((sum, item) => sum + item.quantidade, 0);
  const disponiveis = items.filter((i) => i.status === 'disponivel').length;
  const baixoEstoque = items.filter((i) => i.status === 'baixo').length;
  const indisponiveis = items.filter((i) => i.status === 'indisponivel').length;
  const categorias = Array.from(new Set(items.map((i) => i.categoria))).length;

  // Calculate percentage of available items
  const availabilityRate = totalDistinct > 0 ? Math.round((disponiveis / totalDistinct) * 100) : 0;
  const criticalCount = baixoEstoque + indisponiveis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="stats_container">
      {/* CARD 1: Total de Itens (Classic Premium Bento) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
        id="stat_total_itens"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total de Itens
          </span>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalDistinct}</span>
            <span className="text-xs font-medium text-slate-500">modelos cadastrados</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 font-medium bg-slate-50 px-2.5 py-1.5 rounded-xl w-fit">
            <Boxes className="w-3.5 h-3.5 text-indigo-600" />
            {totalPhysicalUnits} unidades físicas
          </p>
        </div>
      </motion.div>

      {/* CARD 2: Disponíveis (Solid Bento Indigo with percentage & progress bar) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg shadow-indigo-100/60 hover:shadow-xl hover:shadow-indigo-200/80 transition-all duration-200 relative overflow-hidden"
        id="stat_disponibilidade_rate"
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between z-10">
          <span className="text-xs opacity-90 uppercase tracking-wider font-bold">
            Taxa de Disponibilidade
          </span>
          <div className="p-2.5 bg-white/15 text-white rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 z-10">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-3xl font-extrabold tracking-tight">{availabilityRate}%</span>
            <span className="text-[11px] font-semibold opacity-90">
              {disponiveis} de {totalDistinct} ativos
            </span>
          </div>
          
          {/* Progress bar matching Bento motif */}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-2.5">
            <div 
              className="h-full bg-white transition-all duration-500" 
              style={{ width: `${availabilityRate}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Alertas / Baixo Estoque (Solid Bento Dark Theme) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
        className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
        id="stat_baixo_estoque_slate"
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
            Demandas de Atenção
          </span>
          <div className={`p-2.5 rounded-xl ${criticalCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{criticalCount}</span>
            {criticalCount > 0 && (
              <span className="text-[10px] bg-red-500/25 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
                Urgente
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {indisponiveis > 0 
              ? `${indisponiveis} esgotados, ${baixoEstoque} em nível baixo` 
              : criticalCount > 0 
              ? `${baixoEstoque} itens em nível de atenção` 
              : 'Todos os itens adequados'}
          </p>
        </div>
      </motion.div>

      {/* CARD 4: Categorias Ativas (Classic Premium Bento) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.24 }}
        className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
        id="stat_categorias_bento"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Setores Ativos
          </span>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">{categorias}</span>
            <span className="text-xs font-medium text-slate-500">categorias</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Papelaria, Laboratório, Artes, Escrita e Outros
          </p>
        </div>
      </motion.div>
    </div>
  );
}
