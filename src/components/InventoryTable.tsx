import { useState } from 'react';
import { Insumo, CategoriaInsumo, StatusInsumo } from '../types';
import { Search, SlidersHorizontal, Trash2, Edit, CheckCircle2, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp, RefreshCw, Eye } from 'lucide-react';

interface InventoryTableProps {
  items: Insumo[];
  onEdit: (item: Insumo) => void;
  onDelete: (id: number) => void;
  currentlyEditingId?: number;
}

const CATEGORIAS: CategoriaInsumo[] = ['Papelaria', 'Laboratório', 'Arte', 'Escrita', 'Outros'];

export default function InventoryTable({ items, onEdit, onDelete, currentlyEditingId }: InventoryTableProps) {
  const [filterNome, setFilterNome] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<CategoriaInsumo | ''>('');
  const [filterStatus, setFilterStatus] = useState<StatusInsumo | ''>('');
  
  // State to track which items have their observation tray expanded
  const [expandedItemIds, setExpandedItemIds] = useState<number[]>([]);

  const toggleExpandItem = (id: number) => {
    setExpandedItemIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setFilterNome('');
    setFilterCategoria('');
    setFilterStatus('');
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesNome = item.nome.toLowerCase().includes(filterNome.toLowerCase().trim());
    const matchesCategoria = !filterCategoria || item.categoria === filterCategoria;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesNome && matchesCategoria && matchesStatus;
  });

  const getStatusDetails = (status: StatusInsumo) => {
    switch (status) {
      case 'disponivel':
        return {
          label: 'Disponível',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dotColor: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'baixo':
        return {
          label: 'Baixo Estoque',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
          dotColor: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'indisponivel':
        return {
          label: 'Indisponível',
          badgeClass: 'bg-red-50 text-red-700 border-red-100',
          dotColor: 'bg-red-500',
          icon: XCircle,
        };
    }
  };

  const formatUpdateDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // Format as "dd/mm/yyyy às hh:mm" or simple Portuguese string
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full" id="inventory_table_card">
      {/* Title & Stats summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-5 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-base" id="inventory_title">
            Lista de Insumos Registrados
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mostrando {filteredItems.length} de {items.length} itens cadastrados
          </p>
        </div>
        
        {/* Reset filters shortcut if any is selected */}
        {(filterNome || filterCategoria || filterStatus) && (
          <button
            onClick={handleClearFilters}
            className="self-start sm:self-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/60 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
            id="btn_clear_filters_top"
          >
            <RefreshCw className="w-3 h-3" />
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5" id="filters_grid">
        {/* Search input (6 columns) */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            placeholder="Pesquisar por nome do insumo..."
            className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl pl-10 pr-4 py-3 text-slate-800 outline-hidden transition-all duration-200"
            id="filter_search_nome"
          />
        </div>

        {/* Category select (3 columns) */}
        <div className="md:col-span-3 relative">
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value as CategoriaInsumo | '')}
            className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-800 outline-hidden transition-all duration-200 appearance-none cursor-pointer"
            id="filter_select_categoria"
          >
            <option value="">Todas as Categorias</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
            <span className="text-[10px]">▼</span>
          </div>
        </div>

        {/* Status select (3 columns) */}
        <div className="md:col-span-3 relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as StatusInsumo | '')}
            className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-800 outline-hidden transition-all duration-200 appearance-none cursor-pointer"
            id="filter_select_status"
          >
            <option value="">Todos os Status</option>
            <option value="disponivel">Disponível</option>
            <option value="baixo">Baixo Estoque</option>
            <option value="indisponivel">Indisponível</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
            <span className="text-[10px]">▼</span>
          </div>
        </div>

        {/* Sliders indicator decorator (1 column or visual aid) */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center text-slate-400">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 flex-1 min-h-[300px]" id="table_container">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400" id="table_empty_state">
            <Info className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
            <h4 className="font-semibold text-slate-700 text-sm">Nenhum item encontrado</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Nenhum insumo escolar corresponde aos seus filtros de busca atuais. Tente mudar os termos ou limpe a busca.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 rounded-full font-semibold transition-all duration-200 cursor-pointer"
            >
              Ver Todos os Insumos
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse text-left" id="inventory_table">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Insumo</th>
                <th className="py-4 px-4">Categoria</th>
                <th className="py-4 px-4 text-center">Estoque</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700" id="table_body">
              {filteredItems.map((item) => {
                const statusDetails = getStatusDetails(item.status);
                const StatusIcon = statusDetails.icon;
                const isEditing = currentlyEditingId === item.id;
                const isExpanded = expandedItemIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`group transition-all duration-150 hover:bg-slate-50/50 ${
                      isEditing ? 'bg-amber-50/40 hover:bg-amber-50/60 ring-2 ring-amber-400/50 ring-inset' : ''
                    }`}
                  >
                    {/* Item Name */}
                    <td className="py-3 px-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150 text-sm">
                          {item.nome}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Modificado em: {formatUpdateDate(item.dataAtualizacao)}
                          </span>
                          {item.observacao && (
                            <button
                              onClick={() => toggleExpandItem(item.id)}
                              className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              {isExpanded ? 'Esconder nota' : 'Ver nota'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Observation Card inside the row */}
                      {isExpanded && item.observacao && (
                        <div className="mt-2 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/50 text-xs text-slate-600 animate-slide-down">
                          <div className="font-semibold text-indigo-800 mb-0.5">Observações da Supervisão:</div>
                          {item.observacao}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200/60">
                        {item.categoria}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-sm ${item.quantidade === 0 ? 'text-red-500' : 'text-slate-800'}`}>
                        {item.quantidade}
                      </span>
                      <span className="text-[10px] text-slate-400 block">unids</span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusDetails.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${statusDetails.dotColor}`} />
                        {statusDetails.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Notes quick toggle button */}
                        {item.observacao && (
                          <button
                            onClick={() => toggleExpandItem(item.id)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isExpanded
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            title="Visualizar observações"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}
                        
                        {/* Edit button */}
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                          title="Editar insumo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Excluir insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
