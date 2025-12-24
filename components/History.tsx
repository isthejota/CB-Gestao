
import React, { useState } from 'react';
import { Sale, Expense, Drinks } from '../types.ts';
import { formatCurrency, formatDate, formatTime } from '../utils.ts';

interface HistoryProps {
  sales: Sale[];
  expenses: Expense[];
  onDeleteSale: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ sales, expenses, onDeleteSale, onDeleteExpense }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allItems = [
    ...sales.map(s => ({ ...s, itemType: 'sale' as const })),
    ...expenses.map(e => ({ ...e, itemType: 'expense' as const }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderDrinkDetails = (drinks: Drinks) => {
    const activeDrinks = Object.entries(drinks).filter(([_, qty]) => qty > 0);
    if (activeDrinks.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Itens Adicionais</p>
        <div className="flex flex-wrap gap-3">
          {activeDrinks.map(([name, qty]) => (
            <span key={name} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 border border-white/5">
              {qty}x {name === 'refri1l' ? 'Refri 1L' : name === 'refri2l' ? 'Refri 2L' : name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-end px-4">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase md:text-4xl">Histórico</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Fluxo recente de caixa</p>
        </div>
        <span className="bg-zinc-900 text-zinc-400 text-[10px] font-black px-4 py-2 rounded-full border border-white/5 shadow-lg">
          {allItems.length} Registros
        </span>
      </div>
      
      {allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <p className="font-black uppercase text-xs tracking-[0.3em] opacity-40">Nenhuma movimentação encontrada</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {allItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isSale = item.itemType === 'sale';
          const saleItem = item as Sale;
          const expenseItem = item as Expense;

          return (
            <div 
              key={item.id} 
              onClick={() => toggleExpand(item.id)}
              className={`group relative p-6 rounded-[2.5rem] border transition-all duration-300 cursor-pointer ${
                isExpanded 
                ? 'bg-zinc-900 border-zinc-700 shadow-3xl scale-[1.01] z-10' 
                : 'bg-zinc-900/20 border-white/5 hover:bg-zinc-900/40 hover:scale-[1.005]'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-500 ${
                  isExpanded ? 'rotate-[360deg]' : ''
                } ${
                  isSale 
                  ? saleItem.paymentMethod === 'Pix' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-600/10 text-emerald-500'
                  : 'bg-red-600/10 text-red-500'
                }`}>
                  {isSale ? (saleItem.paymentMethod === 'Pix' ? '📱' : '💵') : '🧾'}
                </div>

                <div className="flex-grow min-w-0">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{formatTime(item.timestamp)}</span>
                      <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{formatDate(item.timestamp)}</span>
                   </div>
                   <p className="font-black text-base text-white truncate tracking-tight">
                    {isSale 
                      ? `${saleItem.skewers} ${saleItem.skewers === 1 ? 'espeto' : 'espetos'} ${saleItem.isComplete ? 'completos' : ''}`
                      : expenseItem.description}
                   </p>
                </div>

                <div className="text-right shrink-0">
                   <p className={`text-lg font-black tracking-tighter md:text-xl ${isSale ? 'text-white' : 'text-red-500'}`}>
                    {isSale ? '' : '-'}{formatCurrency(isSale ? saleItem.total : expenseItem.amount)}
                   </p>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       if(confirm("Deseja apagar este registro permanentemente?")) {
                         isSale ? onDeleteSale(item.id) : onDeleteExpense(item.id);
                       }
                     }}
                     className="mt-2 text-[9px] font-black text-zinc-700 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
                   >
                     Excluir
                   </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-white/10 animate-fade">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {isSale ? (
                      <>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Forma</p>
                          <span className={`text-xs font-black uppercase ${saleItem.paymentMethod === 'Pix' ? 'text-blue-400' : 'text-emerald-400'}`}>
                            {saleItem.paymentMethod}
                          </span>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Tipo</p>
                          <span className={`text-xs font-black uppercase ${saleItem.isComplete ? 'text-white' : 'text-zinc-500'}`}>
                            {saleItem.isComplete ? 'Prato Completo' : 'Carne Avulsa'}
                          </span>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 hidden md:block">
                          <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Status</p>
                          <span className="text-xs font-black uppercase text-zinc-300">Concluído</span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 col-span-2 md:col-span-3">
                        <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Categoria</p>
                        <span className="text-xs font-black uppercase text-yellow-500">
                          {expenseItem.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {isSale && renderDrinkDetails(saleItem.drinks)}
                  
                  <div className="mt-6 flex justify-center opacity-10">
                    <span className="text-[7px] font-black uppercase tracking-[0.5em] text-zinc-400">ID: {item.id}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
