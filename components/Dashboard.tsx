
import React from 'react';
import { Sale, Expense } from '../types.ts';
import { formatCurrency, formatNumber, getBusinessDayStart } from '../utils.ts';

interface DashboardProps {
  sales: Sale[];
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, expenses }) => {
  const businessDayStart = getBusinessDayStart(new Date());
  
  const totalSalesValue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpensesValue = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalProfit = totalSalesValue - totalExpensesValue;

  // Filtra vendas do dia de negócio atual (desde as 06:00 AM)
  const daySalesValue = sales
    .filter(s => s.timestamp >= businessDayStart)
    .reduce((acc, s) => acc + s.total, 0);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(getBusinessDayStart(d));
    }
    return days;
  };

  const chartDays = getLast7Days();
  const chartData = chartDays.map(day => {
    const nextDay = day + (24 * 60 * 60 * 1000);
    return sales
      .filter(s => s.timestamp >= day && s.timestamp < nextDay)
      .reduce((acc, s) => acc + s.total, 0);
  });

  const maxVal = Math.max(...chartData, 100);
  const width = 320;
  const height = 80;
  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6">
      {/* Premium Balance Card */}
      <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Saldo Disponível</p>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-black text-zinc-400">R$</span>
             <h2 className="text-5xl font-black tracking-tighter text-white">
                {formatNumber(totalProfit)}
             </h2>
          </div>
          
          <div className="mt-8 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase">Ganhos</p>
                <p className="text-xs font-bold text-emerald-400">+{formatCurrency(totalSalesValue)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
              </div>
              <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase">Gastos</p>
                <p className="text-xs font-bold text-red-400">-{formatCurrency(totalExpensesValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 rounded-[2.5rem] p-6 border border-white/5">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">Caixa Atual</h3>
             <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Ciclo: 06h às 06h</p>
           </div>
           <div className="text-right">
             <p className="text-xl font-black text-white">{formatCurrency(daySalesValue)}</p>
             <p className="text-[8px] text-zinc-500 font-bold uppercase">Total Bruto</p>
           </div>
        </div>
        
        <div className="relative h-20 w-full mb-4">
           <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d={`M0,${height} ${points} L${width},${height} Z`} 
                fill="url(#areaGradient)" 
              />
              <polyline 
                points={points} 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
           </svg>
        </div>
        
        <div className="flex justify-between px-1">
          {['D','S','T','Q','Q','S','S'].map((d, i) => (
            <span key={i} className="text-[9px] font-black text-zinc-600 uppercase">{d}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Total Pix</p>
            <p className="text-lg font-black text-white">
              {formatCurrency(sales.filter(s => s.paymentMethod === 'Pix').reduce((a,b) => a + b.total, 0))}
            </p>
         </div>
         <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Dinheiro</p>
            <p className="text-lg font-black text-white">
              {formatCurrency(sales.filter(s => s.paymentMethod === 'Dinheiro').reduce((a,b) => a + b.total, 0))}
            </p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
