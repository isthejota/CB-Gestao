
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
      <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
        <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Itens de Bebida</p>
        <div className="flex flex-wrap gap-2">
          {activeDrinks.map(([name, qty]) => (
            <span key={name} className="bg-white/5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-zinc-300 border border-white/5">
              {qty}x {name === 'refri1l' ? 'Refri 1L' : name === 'refri2l' ? 'Refri 2L' : name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade pb-20">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">Atividade</h2>
        <span className="bg-zinc-900 text-zinc-500 text-[10px] font-black px-3 py-1 rounded-full border border-white/5">
          {allItems.length} Registros
        </span>
      </div>
      
      {allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <p className="font-black uppercase text-[10px] tracking-[0.2em]">Sem movimentações</p>
        </div>
      )}

      <div className="space-y-3">
        {allItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isSale = item.itemType === 'sale';
          const saleItem = item as Sale;
          const expenseItem = item as Expense;

          return (
            <div 
              key={item.id} 
              onClick={() => toggleExpand(item.id)}
              className={`group relative bg-zinc-900/30 p-5 rounded-[2rem] border transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                isExpanded ? 'border-zinc-700 bg-zinc-900 shadow-2xl scale-[1.02] z-10' : 'border-white/5 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all ${
                  isExpanded ? 'rotate-12' : ''
                } ${
                  isSale 
                  ? saleItem.paymentMethod === 'Pix' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-600/10 text-emerald-500'
                  : 'bg-red-600/10 text-red-500'
                }`}>
                  {isSale ? (saleItem.paymentMethod === 'Pix' ? '📱' : '💵') : '🧾'}
                </div>

                <div className="flex-grow overflow-hidden">
                   <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">{formatTime(item.timestamp)}</span>
                      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">{formatDate(item.timestamp)}</span>
                   </div>
                   <p className="font-bold text-sm text-white truncate leading-tight">
                    {isSale 
                      ? `${saleItem.skewers} ${saleItem.skewers === 1 ? 'espeto' : 'espetos'} ${saleItem.isComplete ? 'completos' : ''}`
                      : expenseItem.description}
                   </p>
                </div>

                <div className="text-right shrink-0">
                   <p className={`text-sm font-black tracking-tighter ${isSale ? 'text-white' : 'text-red-500'}`}>
                    {isSale ? '' : '-'}{formatCurrency(isSale ? saleItem.total : expenseItem.amount)}
                   </p>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       if(confirm("Deseja apagar este registro permanentemente?")) {
                         isSale ? onDeleteSale(item.id) : onDeleteExpense(item.id);
                       }
                     }}
                     className="mt-1 text-[9px] font-black text-zinc-700 hover:text-red-500 uppercase tracking-widest transition-colors"
                   >
                     Remover
                   </button>
                </div>
              </div>

              {/* Detalhes Expansíveis */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-fade overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {isSale ? (
                      <>
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Pagamento</p>
                          <span className={`text-[10px] font-black uppercase ${saleItem.paymentMethod === 'Pix' ? 'text-blue-400' : 'text-emerald-400'}`}>
                            {saleItem.paymentMethod}
                          </span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-2xl border border-white/5">
                          <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Preparação</p>
                          <span className={`text-[10px] font-black uppercase ${saleItem.isComplete ? 'text-white' : 'text-zinc-500'}`}>
                            {saleItem.isComplete ? 'Acompanhamentos' : 'Apenas Carne'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="bg-black/20 p-3 rounded-2xl border border-white/5 col-span-2">
                        <p className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-1">Categoria de Lançamento</p>
                        <span className="text-[10px] font-black uppercase text-yellow-500">
                          {expenseItem.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {isSale && renderDrinkDetails(saleItem.drinks)}
                  
                  <div className="mt-4 flex flex-col items-center gap-2 opacity-20">
                    <div className="w-12 h-0.5 bg-zinc-800 rounded-full"></div>
                    <span className="text-[7px] font-black uppercase text-zinc-500">ID: {item.id.slice(0,8)}</span>
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
