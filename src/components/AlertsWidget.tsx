import { Insumo } from '../types';
import { AlertCircle, AlertTriangle, ShieldCheck, Zap, Plus } from 'lucide-react';

interface AlertsWidgetProps {
  items: Insumo[];
  onQuickRefill: (id: number, amount: number) => void;
}

export default function AlertsWidget({ items, onQuickRefill }: AlertsWidgetProps) {
  // Filter for items in baixo or indisponivel status
  const criticalItems = items.filter(
    (item) => item.status === 'baixo' || item.status === 'indisponivel'
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full" id="alerts_widget_container">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${criticalItems.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Demandas Críticas / Alertas
          </h3>
        </div>
        {criticalItems.length > 0 && (
          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
            {criticalItems.length} Alertas
          </span>
        )}
      </div>

      {criticalItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-slate-400">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h4 className="font-semibold text-slate-700 text-xs">Estoque Sob Controle</h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
            Nenhum insumo encontra-se com estoque baixo ou zerado no momento. Excelente trabalho!
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] scrollbar-thin" id="alerts_list">
          {criticalItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors duration-150 ${
                item.status === 'indisponivel'
                  ? 'bg-red-50/40 border-red-100/70 text-red-950'
                  : 'bg-amber-50/40 border-amber-100/70 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                  item.status === 'indisponivel' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {item.nome}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                    {item.categoria} • {item.quantidade === 0 ? 'Indisponível' : `${item.quantidade} unidades restantes`}
                  </p>
                </div>
              </div>

              {/* Quick replenishment controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 mr-1 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Repor:
                </span>
                
                {/* +5 Units */}
                <button
                  onClick={() => onQuickRefill(item.id, 5)}
                  className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-all shadow-xs cursor-pointer"
                  title="Adicionar 5 unidades"
                >
                  <Plus className="w-2.5 h-2.5" />5
                </button>

                {/* +20 Units */}
                <button
                  onClick={() => onQuickRefill(item.id, 20)}
                  className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 py-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-all shadow-xs cursor-pointer"
                  title="Adicionar 20 unidades"
                >
                  <Plus className="w-2.5 h-2.5" />20
                </button>

                {/* +50 Units */}
                <button
                  onClick={() => onQuickRefill(item.id, 50)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent py-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition-all shadow-xs cursor-pointer"
                  title="Adicionar 50 unidades"
                >
                  <Plus className="w-2.5 h-2.5" />50
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
