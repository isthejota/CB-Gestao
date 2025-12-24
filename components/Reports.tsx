
import React from 'react';
import { Sale, Expense } from '../types';
import { formatCurrency, formatDate, getCurrentWeekRange, getBusinessDayStart } from '../utils';

interface ReportsProps {
  sales: Sale[];
  expenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ sales, expenses }) => {
  const weekRange = getCurrentWeekRange();
  
  // Agrupamento por Dia de Negócio
  const dailyData: { [key: number]: { sales: number; expenses: number; pix: number; cash: number } } = {};
  
  sales.forEach(s => {
    const day = getBusinessDayStart(new Date(s.timestamp));
    if (!dailyData[day]) dailyData[day] = { sales: 0, expenses: 0, pix: 0, cash: 0 };
    dailyData[day].sales += s.total;
    if (s.paymentMethod === 'Pix') dailyData[day].pix += s.total;
    else dailyData[day].cash += s.total;
  });

  expenses.forEach(e => {
    const day = getBusinessDayStart(new Date(e.timestamp));
    if (!dailyData[day]) dailyData[day] = { sales: 0, expenses: 0, pix: 0, cash: 0 };
    dailyData[day].expenses += e.amount;
  });

  const sortedDays = Object.keys(dailyData).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-8 animate-fade">
      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase text-white border-b-2 border-red-600 pb-2 italic">Ciclo Semanal</h2>
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-black uppercase tracking-widest">
            <span>Fim de Semana</span>
            <span className="bg-white/5 px-2 py-1 rounded text-zinc-400">Ativo</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-zinc-400 font-bold uppercase">Total Bruto:</span>
              <span className="text-xl font-black text-white">
                {formatCurrency(sales.filter(s => s.timestamp >= weekRange.start && s.timestamp <= weekRange.end).reduce((a, b) => a + b.total, 0))}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-zinc-400 font-bold uppercase">Gastos:</span>
              <span className="text-sm font-black text-red-500">
                -{formatCurrency(expenses.filter(e => e.timestamp >= weekRange.start && e.timestamp <= weekRange.end).reduce((a, b) => a + b.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <h2 className="text-xl font-black uppercase text-white border-b-2 border-zinc-800 pb-2 italic">Histórico Diário</h2>
        <p className="text-[10px] text-zinc-600 font-bold uppercase px-1">Nota: Ciclo de 24h inicia às 06:00 AM</p>
        
        {sortedDays.length === 0 && <p className="text-center py-10 text-zinc-700 font-bold uppercase text-xs">Sem dados</p>}
        
        {sortedDays.map(day => {
          const data = dailyData[day];
          const profit = data.sales - data.expenses;
          return (
            <div key={day} className="bg-zinc-900/30 rounded-3xl overflow-hidden border border-white/5 transition-all hover:bg-zinc-900/50">
              <div className="bg-white/5 p-4 flex justify-between items-center">
                <span className="font-black text-xs uppercase text-zinc-400 tracking-tighter">{formatDate(day)}</span>
                <span className={`text-sm font-black ${profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                  {formatCurrency(profit)}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-500 uppercase tracking-tighter">Entradas (Pix/Din):</span>
                  <div className="text-right">
                    <p className="text-white font-black">{formatCurrency(data.sales)}</p>
                    <p className="text-[9px] text-zinc-600">P: {formatCurrency(data.pix)} | D: {formatCurrency(data.cash)}</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold border-t border-white/5 pt-3">
                  <span className="text-zinc-500 uppercase tracking-tighter">Saídas/Custos:</span>
                  <span className="text-red-400 font-black">-{formatCurrency(data.expenses)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Reports;
