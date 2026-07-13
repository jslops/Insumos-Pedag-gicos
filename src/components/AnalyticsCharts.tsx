import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Insumo } from '../types';
import { BarChart3, PieChart as PieIcon, Info } from 'lucide-react';

interface AnalyticsChartsProps {
  items: Insumo[];
}

export default function AnalyticsCharts({ items }: AnalyticsChartsProps) {
  // 1. Group items count and sum quantities by category
  const categoriesList: Insumo['categoria'][] = ['Papelaria', 'Laboratório', 'Arte', 'Escrita', 'Outros'];
  const categoryData = categoriesList.map((cat) => {
    const catItems = items.filter((item) => item.categoria === cat);
    const totalQuantity = catItems.reduce((sum, item) => sum + item.quantidade, 0);
    const distinctCount = catItems.length;
    return {
      name: cat,
      Quantidade: totalQuantity,
      Itens: distinctCount,
    };
  });

  // 2. Group items by status
  const statusCounts = {
    disponivel: items.filter((i) => i.status === 'disponivel').length,
    baixo: items.filter((i) => i.status === 'baixo').length,
    indisponivel: items.filter((i) => i.status === 'indisponivel').length,
  };

  const statusData = [
    { name: 'Disponível', value: statusCounts.disponivel, color: '#10b981' }, // emerald-500
    { name: 'Baixo Estoque', value: statusCounts.baixo, color: '#f59e0b' },   // amber-500
    { name: 'Indisponível', value: statusCounts.indisponivel, color: '#ef4444' }, // red-500
  ].filter((item) => item.value > 0); // only show if count > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8" id="analytics_charts_grid">
      {/* Horizontal Bar Chart (3/5 width on lg) */}
      <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 flex flex-col shadow-sm" id="chart_bar_container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Volume de Insumos por Categoria
          </h3>
          <span className="text-slate-400 text-xs font-medium">Unidades em estoque</span>
        </div>

        <div className="h-64 w-full flex-1">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              <Info className="w-8 h-8 mb-2 opacity-40" />
              Nenhum dado disponível para exibir.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="horizontal"
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar
                  dataKey="Quantidade"
                  name="Unidades físicas"
                  fill="#4f46e5"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status Donut/Pie Chart (2/5 width on lg) */}
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 flex flex-col shadow-sm" id="chart_pie_container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-600" />
            Status de Disponibilidade
          </h3>
          <span className="text-slate-400 text-xs font-medium">Divisão por item</span>
        </div>

        <div className="h-64 w-full flex-1 flex flex-col justify-center">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              <Info className="w-8 h-8 mb-2 opacity-40" />
              Nenhum item cadastrado.
            </div>
          ) : statusData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              Nenhum status cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 items-center h-full">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {item.value} {item.value === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
