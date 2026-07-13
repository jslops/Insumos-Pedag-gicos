import { LogAtividade } from '../types';
import { History, Trash, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

interface ActivityLogProps {
  logs: LogAtividade[];
  onClearLogs: () => void;
}

export default function ActivityLog({ logs, onClearLogs }: ActivityLogProps) {
  const getLogTypeStyling = (tipo: LogAtividade['tipo']) => {
    switch (tipo) {
      case 'adicionado':
        return {
          bgColor: 'bg-indigo-50 text-indigo-600',
          borderColor: 'border-indigo-100',
          badgeText: 'Cadastro',
        };
      case 'atualizado':
        return {
          bgColor: 'bg-amber-50 text-amber-600',
          borderColor: 'border-amber-100',
          badgeText: 'Edição',
        };
      case 'removido':
        return {
          bgColor: 'bg-rose-50 text-rose-600',
          borderColor: 'border-rose-100',
          badgeText: 'Remoção',
        };
      case 'ajuste_estoque':
        return {
          bgColor: 'bg-emerald-50 text-emerald-600',
          borderColor: 'border-emerald-100',
          badgeText: 'Ajuste',
        };
    }
  };

  const formatLogTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // E.g., "13/07 - 09:58"
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full" id="activity_log_container">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Atividades Recentes
          </h3>
        </div>
        
        {logs.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Deseja realmente limpar todo o histórico de atividades recentes?')) {
                onClearLogs();
              }
            }}
            className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
            id="clear_logs_btn"
          >
            <Trash className="w-3 h-3" />
            Limpar Histórico
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
            <FileText className="w-8 h-8 opacity-40" />
          </div>
          <h4 className="font-semibold text-slate-700 text-xs">Nenhuma Atividade</h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
            Nenhuma movimentação de estoque ou alteração foi registrada ainda.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 max-h-[300px] scrollbar-thin space-y-4" id="logs_list_scroll">
          {logs.map((log) => {
            const styling = getLogTypeStyling(log.tipo);
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 text-xs relative"
                id={`log_item_${log.id}`}
              >
                {/* Timeline connector visual line */}
                <div className="absolute top-8 bottom-0 left-4 w-[1px] bg-slate-100 hidden last:block" />

                {/* Status Dot / Type Icon Indicator */}
                <div className={`p-1.5 rounded-full mt-0.5 shrink-0 border ${styling.bgColor} ${styling.borderColor}`}>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-800 text-xs truncate">
                      {log.itemNome}
                    </span>
                    <span className="text-[9px] font-mono font-medium text-slate-400 shrink-0">
                      {formatLogTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {log.descricao}
                  </p>
                  <div className="mt-1.5">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-md border ${styling.bgColor} ${styling.borderColor}`}>
                      {styling.badgeText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
