
import React, { useState } from 'react';
import { Sale, PaymentMethod, Drinks } from '../types';

interface SalesFormProps {
  onAddSale: (sale: Sale) => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ onAddSale }) => {
  const [skewers, setSkewers] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [drinks, setDrinks] = useState<Drinks>({
    suco: 0,
    latinha: 0,
    refri1l: 0,
    refri2l: 0
  });
  const [total, setTotal] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>('0,00');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é número
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue || '0', 10) / 100;
    
    setTotal(numericValue);
    setDisplayValue(numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  };

  const updateDrink = (type: keyof Drinks, delta: number) => {
    setDrinks(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0) {
      alert("Informe o valor da venda.");
      return;
    }
    onAddSale({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      skewers,
      isComplete,
      drinks,
      total,
      paymentMethod
    });
    
    // Reset total
    setSkewers(0);
    setIsComplete(false);
    setDrinks({ suco: 0, latinha: 0, refri1l: 0, refri2l: 0 });
    setTotal(0);
    setDisplayValue('0,00');
  };

  const QtySelector = ({ label, value, onDec, onInc, color = "zinc" }: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter ml-1 pointer-events-none">{label}</span>
      <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5 h-12">
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); onDec(); }} 
          className="w-10 h-10 flex items-center justify-center text-zinc-500 active:text-white active:scale-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span className="flex-1 text-center text-sm font-black text-white pointer-events-none">{value}</span>
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); onInc(); }} 
          className={`w-10 h-10 flex items-center justify-center rounded-lg active:scale-90 transition-all ${color === 'red' ? 'text-red-600 active:bg-red-600/10' : 'text-zinc-400 active:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade pb-10" onKeyPress={(e) => { if(e.key === 'Enter') e.preventDefault(); }}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black tracking-tighter uppercase italic text-white">Nova Venda</h2>
        <div className="w-8 h-1 bg-red-600 rounded-full mt-1"></div>
      </div>
      
      {/* Input de Valor (Topo) */}
      <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center shadow-inner relative transition-all focus-within:border-red-600/30">
        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1 pointer-events-none">Total Recebido</label>
        <div className="flex items-center">
          <span className="text-xl font-black text-red-600 mr-2 opacity-40">R$</span>
          <input 
            type="text" 
            inputMode="numeric"
            value={displayValue} 
            onChange={handleValueChange}
            className="bg-transparent text-5xl font-black text-white focus:outline-none w-56 text-center tracking-tighter"
            placeholder="0,00"
          />
        </div>
      </div>

      {/* Seção Espetos */}
      <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 grid grid-cols-2 gap-4 items-end">
        <QtySelector 
          label="Espetos" 
          value={skewers} 
          onDec={() => setSkewers(Math.max(0, skewers - 1))} 
          onInc={() => setSkewers(skewers + 1)} 
          color="red"
        />
        <button 
          type="button"
          onClick={() => setIsComplete(!isComplete)}
          className={`h-12 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
            isComplete 
            ? 'bg-white text-black border-white font-black' 
            : 'bg-black/30 border-zinc-800 text-zinc-600 font-bold'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${isComplete ? 'border-black' : 'border-zinc-800'}`}>
            {isComplete && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
          </div>
          <span className="text-[10px] uppercase">Completo</span>
        </button>
      </div>

      {/* Seção Bebidas */}
      <div className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 pointer-events-none"><path d="M12 2v20"/><path d="M7 22h10"/><path d="M12 7V2l-4 4"/></svg>
          <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pointer-events-none">Bebidas</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <QtySelector label="Suco" value={drinks.suco} onDec={() => updateDrink('suco', -1)} onInc={() => updateDrink('suco', 1)} />
          <QtySelector label="Latinha" value={drinks.latinha} onDec={() => updateDrink('latinha', -1)} onInc={() => updateDrink('latinha', 1)} />
          <QtySelector label="Refri 1L" value={drinks.refri1l} onDec={() => updateDrink('refri1l', -1)} onInc={() => updateDrink('refri1l', 1)} />
          <QtySelector label="Refri 2L" value={drinks.refri2l} onDec={() => updateDrink('refri2l', -1)} onInc={() => updateDrink('refri2l', 1)} />
        </div>
      </div>

      {/* Pagamento */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          type="button" 
          onClick={() => setPaymentMethod('Pix')}
          className={`py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 active:scale-95 ${
            paymentMethod === 'Pix' 
            ? 'bg-blue-600 border-blue-500 text-white font-black shadow-lg shadow-blue-900/40' 
            : 'bg-zinc-900/60 border-white/5 text-zinc-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
          <span className="text-[11px] font-black uppercase tracking-widest">Pix</span>
        </button>
        <button 
          type="button" 
          onClick={() => setPaymentMethod('Dinheiro')}
          className={`py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 active:scale-95 ${
            paymentMethod === 'Dinheiro' 
            ? 'bg-emerald-600 border-emerald-500 text-white font-black shadow-lg shadow-emerald-900/40' 
            : 'bg-zinc-900/60 border-white/5 text-zinc-600'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="text-[11px] font-black uppercase tracking-widest">Dinheiro</span>
        </button>
      </div>

      <button 
        type="submit" 
        className="w-full py-5 bg-white text-black rounded-full font-black text-lg uppercase tracking-tighter shadow-xl active:scale-[0.98] transition-all mt-2 active:bg-zinc-200"
      >
        Confirmar Venda
      </button>
    </form>
  );
};

export default SalesForm;
