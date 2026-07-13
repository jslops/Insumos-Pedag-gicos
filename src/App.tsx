import { useState, useEffect } from 'react';
import { Insumo, LogAtividade } from './types';
import {
  loadInsumos,
  saveInsumos,
  loadLogs,
  saveLogs,
  INITIAL_INSUMOS,
  INITIAL_LOGS
} from './data/initialData';

// Component Imports
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import ItemForm from './components/ItemForm';
import InventoryTable from './components/InventoryTable';
import AlertsWidget from './components/AlertsWidget';
import ActivityLog from './components/ActivityLog';

import { Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [items, setItems] = useState<Insumo[]>(() => loadInsumos());
  const [logs, setLogs] = useState<LogAtividade[]>(() => loadLogs());
  const [editItem, setEditItem] = useState<Insumo | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'success' | 'info' | 'warn' }>({
    message: '',
    visible: false,
    type: 'success',
  });

  // Automatically sync to local storage whenever items or logs change
  useEffect(() => {
    saveInsumos(items);
  }, [items]);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // Trigger automated toast message helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, visible: true, type });
  };

  // Automatically dismiss toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Create or Update Supply Item Handler
  const handleSaveItem = (itemData: Omit<Insumo, 'id' | 'dataAtualizacao'> & { id?: number }) => {
    const nowISO = new Date().toISOString();

    if (itemData.id) {
      // Edit mode
      const oldItem = items.find((i) => i.id === itemData.id);
      const updatedItems = items.map((item) => {
        if (item.id === itemData.id) {
          return {
            ...item,
            nome: itemData.nome,
            categoria: itemData.categoria,
            quantidade: itemData.quantidade,
            status: itemData.status,
            observacao: itemData.observacao,
            dataAtualizacao: nowISO,
          };
        }
        return item;
      });

      setItems(updatedItems);
      setEditItem(null);

      // Create log
      const newLog: LogAtividade = {
        id: `log_${Date.now()}`,
        itemNome: itemData.nome,
        tipo: 'atualizado',
        descricao: `Alterado de ${oldItem?.quantidade} para ${itemData.quantidade} unidades. Categoria: ${itemData.categoria}.`,
        timestamp: nowISO,
      };
      setLogs((prev) => [newLog, ...prev]);
      triggerToast(`Insumo "${itemData.nome}" atualizado!`, 'success');
    } else {
      // Create mode
      const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      const newItem: Insumo = {
        id: nextId,
        nome: itemData.nome,
        categoria: itemData.categoria,
        quantidade: itemData.quantidade,
        status: itemData.status,
        observacao: itemData.observacao,
        dataAtualizacao: nowISO,
      };

      setItems((prev) => [...prev, newItem]);

      // Create log
      const newLog: LogAtividade = {
        id: `log_${Date.now()}`,
        itemNome: itemData.nome,
        tipo: 'adicionado',
        descricao: `Novo insumo cadastrado com estoque inicial de ${itemData.quantidade} unidades.`,
        timestamp: nowISO,
      };
      setLogs((prev) => [newLog, ...prev]);
      triggerToast(`Insumo "${itemData.nome}" cadastrado com sucesso!`, 'success');
    }
  };

  // Delete Supply Item Handler
  const handleDeleteItem = (id: number) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!itemToDelete) return;

    if (confirm(`Deseja realmente remover o insumo "${itemToDelete.nome}" do catálogo da supervisão?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      
      // If currently editing this item, cancel editing
      if (editItem?.id === id) {
        setEditItem(null);
      }

      // Create log
      const newLog: LogAtividade = {
        id: `log_${Date.now()}`,
        itemNome: itemToDelete.nome,
        tipo: 'removido',
        descricao: `Insumo excluído permanentemente do estoque pela Supervisão.`,
        timestamp: new Date().toISOString(),
      };
      setLogs((prev) => [newLog, ...prev]);
      triggerToast(`Insumo "${itemToDelete.nome}" excluído.`, 'warn');
    }
  };

  // Select Item for Editing
  const handleEditItemSelect = (item: Insumo) => {
    setEditItem(item);
    triggerToast(`Editando: ${item.nome}`, 'info');
  };

  // Cancel Edit Mode
  const handleCancelEdit = () => {
    setEditItem(null);
    triggerToast('Edição cancelada.', 'info');
  };

  // Quick stock refill (adds amount directly from the alerts panel)
  const handleQuickRefill = (id: number, amount: number) => {
    const nowISO = new Date().toISOString();
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQty = item.quantidade + amount;
        // Auto-calculate appropriate status based on new quantity
        let newStatus = item.status;
        if (newQty > 5) {
          newStatus = 'disponivel';
        } else if (newQty > 0) {
          newStatus = 'baixo';
        } else {
          newStatus = 'indisponivel';
        }

        return {
          ...item,
          quantidade: newQty,
          status: newStatus,
          dataAtualizacao: nowISO,
        };
      }
      return item;
    });

    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    setItems(updatedItems);

    // Create log
    const newLog: LogAtividade = {
      id: `log_${Date.now()}`,
      itemNome: targetItem.nome,
      tipo: 'ajuste_estoque',
      descricao: `Reposição rápida de +${amount} unidades via painel de alertas. Novo total: ${targetItem.quantidade + amount} unidades.`,
      timestamp: nowISO,
    };
    setLogs((prev) => [newLog, ...prev]);
    triggerToast(`Abastecido +${amount} unidades de "${targetItem.nome}"!`, 'success');
  };

  // Reset entire database to default original settings
  const handleResetData = () => {
    setItems(INITIAL_INSUMOS);
    setLogs(INITIAL_LOGS);
    setEditItem(null);
    triggerToast('Banco de dados restaurado!', 'success');
  };

  // Clear Activity logs list
  const handleClearLogs = () => {
    setLogs([]);
    triggerToast('Histórico de logs limpo!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <Header onResetData={handleResetData} />

        {/* Mini KPI stats Dashboard row */}
        <DashboardStats items={items} />

        {/* Analytics Section (Bar and Pie charts) */}
        <AnalyticsCharts items={items} />

        {/* Work Bench dual grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="app_main_work_bench">
          
          {/* Left Column (Forms, Alerts and activity feed log) - spans 4 cols on XL */}
          <div className="xl:col-span-4 space-y-6 flex flex-col">
            {/* Form card */}
            <div className="h-auto">
              <ItemForm
                editItem={editItem}
                onSave={handleSaveItem}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            {/* Critical alert notifications widget */}
            <div className="h-auto">
              <AlertsWidget
                items={items}
                onQuickRefill={handleQuickRefill}
              />
            </div>

            {/* Audit activity stream logger */}
            <div className="h-auto">
              <ActivityLog
                logs={logs}
                onClearLogs={handleClearLogs}
              />
            </div>
          </div>

          {/* Right Column (Inventory Table) - spans 8 cols on XL */}
          <div className="xl:col-span-8 h-full">
            <InventoryTable
              items={items}
              onEdit={handleEditItemSelect}
              onDelete={handleDeleteItem}
              currentlyEditingId={editItem?.id}
            />
          </div>

        </div>

      </div>

      {/* Floating Animated Toast Banner */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm"
            id="app_toast_banner"
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400'
                : toast.type === 'warn'
                ? 'bg-rose-500/10 text-rose-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : toast.type === 'warn' ? (
                <ShieldAlert className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>
            <p className="text-xs font-semibold tracking-tight">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
