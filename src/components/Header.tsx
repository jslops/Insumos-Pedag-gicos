import { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, Calendar, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onResetData: () => void;
}

export default function Header({ onResetData }: HeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setTime(now.toLocaleDateString('pt-BR', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-500/10">
          <LayoutDashboard className="w-8 h-8" id="header_icon_dashboard" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight" id="header_title">
              Insumos Pedagógicos
            </h1>
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-100" id="header_badge_pedagogico">
              <GraduationCap className="w-3.5 h-3.5" />
              Supervisão Escolar
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5" id="header_subtitle">
            Gestão inteligente de estoques, insumos e demandas de ensino.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Real-time Clock Widget */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-600 px-4 py-2 rounded-2xl text-xs font-medium font-mono" id="header_clock_widget">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{time || 'Carregando data...'}</span>
        </div>

        {/* Reset / Demo restore button */}
        <button
          onClick={() => {
            if (confirm('Deseja redefinir todo o estoque para as configurações padrão originais? Todos os seus dados adicionais serão restaurados.')) {
              onResetData();
            }
          }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer"
          title="Restaurar dados padrão"
          id="header_reset_btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restaurar Padrão
        </button>
      </div>
    </header>
  );
}
