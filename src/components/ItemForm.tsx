import { useState, useEffect, FormEvent } from 'react';
import { Insumo, CategoriaInsumo, StatusInsumo } from '../types';
import { PlusCircle, FileEdit, HelpCircle, Save, XCircle, AlertCircle } from 'lucide-react';

interface ItemFormProps {
  editItem: Insumo | null;
  onSave: (item: Omit<Insumo, 'id' | 'dataAtualizacao'> & { id?: number }) => void;
  onCancelEdit: () => void;
}

const CATEGORIAS: CategoriaInsumo[] = ['Papelaria', 'Laboratório', 'Arte', 'Escrita', 'Outros'];

export default function ItemForm({ editItem, onSave, onCancelEdit }: ItemFormProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaInsumo>('Papelaria');
  const [quantidade, setQuantidade] = useState<number | ''>('');
  const [status, setStatus] = useState<StatusInsumo>('disponivel');
  const [observacao, setObservacao] = useState('');
  
  // Flag to know if user manually modified status (so we don't overwrite their manual selection with auto-suggestions)
  const [isStatusManuallySet, setIsStatusManuallySet] = useState(false);

  useEffect(() => {
    if (editItem) {
      setNome(editItem.nome);
      setCategoria(editItem.categoria);
      setQuantidade(editItem.quantidade);
      setStatus(editItem.status);
      setObservacao(editItem.observacao || '');
      setIsStatusManuallySet(true); // Treat as manually set to keep what is in database
    } else {
      resetFields();
    }
  }, [editItem]);

  const resetFields = () => {
    setNome('');
    setCategoria('Papelaria');
    setQuantidade('');
    setStatus('disponivel');
    setObservacao('');
    setIsStatusManuallySet(false);
  };

  // Smart status autocompleter
  const handleQuantidadeChange = (valStr: string) => {
    if (valStr === '') {
      setQuantidade('');
      return;
    }
    const val = parseInt(valStr, 10);
    if (isNaN(val) || val < 0) return;
    
    setQuantidade(val);

    // Auto-update status if not manually overridden by user
    if (!isStatusManuallySet) {
      if (val === 0) {
        setStatus('indisponivel');
      } else if (val <= 5) {
        setStatus('baixo');
      } else {
        setStatus('disponivel');
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const finalQuantidade = quantidade === '' ? 0 : quantidade;
    
    onSave({
      id: editItem ? editItem.id : undefined,
      nome: nome.trim(),
      categoria,
      quantidade: finalQuantidade,
      status,
      observacao: observacao.trim() || undefined,
    });

    resetFields();
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full" id="item_form_container">
      <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-200">
        <div className={`p-2 rounded-xl ${editItem ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
          {editItem ? <FileEdit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
        </div>
        <h2 className="text-base font-bold text-slate-800" id="form_title">
          {editItem ? 'Editar Insumo Escolar' : 'Cadastrar Novo Insumo'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        {/* Nome do Insumo */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Nome do Insumo *
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Réguas de acrílico 30cm"
            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-2.5 text-slate-800 outline-hidden transition-all duration-200"
            id="input_nome"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Categoria Pedagógica
          </label>
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
              className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-2.5 text-slate-800 outline-hidden transition-all duration-200 appearance-none cursor-pointer"
              id="select_categoria"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Quantidade Atual *
          </label>
          <input
            type="number"
            required
            min="0"
            value={quantidade}
            onChange={(e) => handleQuantidadeChange(e.target.value)}
            placeholder="Ex: 24"
            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-2.5 text-slate-800 outline-hidden transition-all duration-200"
            id="input_quantidade"
          />
        </div>

        {/* Status */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Status de Disponibilidade
            </label>
            {isStatusManuallySet && !editItem && (
              <button
                type="button"
                onClick={() => {
                  setIsStatusManuallySet(false);
                  // Trigger calculation immediately
                  const val = quantidade === '' ? 0 : quantidade;
                  if (val === 0) setStatus('indisponivel');
                  else if (val <= 5) setStatus('baixo');
                  else setStatus('disponivel');
                }}
                className="text-[10px] text-indigo-600 hover:underline"
              >
                Ativar Sugestão
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2" id="status_radio_group">
            {[
              { id: 'disponivel', label: 'Disponível', color: 'border-emerald-200 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 active:ring-emerald-500 checked:bg-emerald-600' },
              { id: 'baixo', label: 'Baixo', color: 'border-amber-200 text-amber-700 bg-amber-50/40 hover:bg-amber-50 active:ring-amber-500 checked:bg-amber-600' },
              { id: 'indisponivel', label: 'Indisponível', color: 'border-red-200 text-red-700 bg-red-50/40 hover:bg-red-50 active:ring-red-500 checked:bg-red-600' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStatus(s.id as StatusInsumo);
                  setIsStatusManuallySet(true);
                }}
                className={`text-xs py-2 px-1 rounded-xl font-medium border text-center transition-all duration-150 cursor-pointer ${
                  status === s.id
                    ? s.id === 'disponivel'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : s.id === 'baixo'
                      ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs'
                      : 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Assistive Hint */}
          <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            {status === 'disponivel' && 'Indicado para itens com estoque adequado.'}
            {status === 'baixo' && 'Alerta de reabastecimento urgente.'}
            {status === 'indisponivel' && 'Itens zerados ou sob encomenda.'}
          </p>
        </div>

        {/* Observações */}
        <div className="flex-1 min-h-[80px] flex flex-col">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Observações / Local de Armazenamento
          </label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Armário B, prateleira 3. Para uso das turmas A e B."
            className="w-full text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl px-4 py-2.5 text-slate-800 outline-hidden transition-all duration-200 resize-none flex-1 min-h-[80px]"
            id="textarea_observacao"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          {editItem && (
            <button
              type="button"
              onClick={() => {
                resetFields();
                onCancelEdit();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer"
              id="btn_cancel_edit"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className={`flex-2 flex items-center justify-center gap-2 text-white py-3 px-4 rounded-2xl text-xs font-bold shadow-md transition-all duration-200 cursor-pointer ${
              editItem
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10'
            }`}
            id="btn_submit_form"
          >
            <Save className="w-4 h-4" />
            {editItem ? 'Atualizar Item' : 'Gravar Insumo'}
          </button>
        </div>
      </form>
    </div>
  );
}
