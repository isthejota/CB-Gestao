
import React, { useState } from 'react';
import { Sale, PaymentMethod, Drinks } from '../types.ts';

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
    
    setSkewers(0);
    setIsComplete(false);
    setDrinks({ suco: 0, latinha: 0, refri1l: 0, refri2l: 0 });
    setTotal(0);
    setDisplayValue('0,00');
  };

  const QtySelector = ({ label, value, onDec, onInc, color = "zinc" }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter ml-1 pointer-events-none">{label}</span>
      <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5 h-14">
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); onDec(); }} 
          className="w-12 h-12 flex items-center justify-center text-zinc-500 active:text-white active:scale-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span className="flex-1 text-center text-base font-black text-white pointer-events-none">{value}</span>
        <button 
          type="button" 
          onClick={(e) => { e.preventDefault(); onInc(); }} 
          className={`w-12 h-12 flex items-center justify-center rounded-lg active:scale-90 transition-all ${color === 'red' ? 'text-red-600 active:bg-red-600/10' : 'text-zinc-400 active:bg-white/5'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8 animate-fade pb-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white md:text-3xl">Nova Venda</h2>
          <div className="w-12 h-1.5 bg-red-600 rounded-full mt-2"></div>
        </div>
        
        {/* Valor - Seção Principal */}
        <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center shadow-inner relative transition-all focus-within:border-red-600/40 md:p-14">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pointer-events-none">Total Recebido</label>
          <div className="flex items-center">
            <span className="text-3xl font-black text-red-600 mr-3 opacity-40">R$</span>
            <input 
              type="text" 
              inputMode="numeric"
              value={displayValue} 
              onChange={handleValueChange}
              className="bg-transparent text-6xl font-black text-white focus:outline-none w-full max-w-xs text-center tracking-tighter md:text-8xl"
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Espetos e Preparação */}
          <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pointer-events-none">Alimentação</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
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
                className={`h-14 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
                  isComplete 
                  ? 'bg-white text-black border-white font-black' 
                  : 'bg-black/30 border-zinc-800 text-zinc-600 font-bold'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isComplete ? 'border-black' : 'border-zinc-800'}`}>
                  {isComplete && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <span className="text-xs uppercase tracking-tighter">Completo</span>
              </button>
            </div>
          </div>

          {/* Bebidas */}
          <div className="bg-zinc-900/40 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 pointer-events-none"><path d="M12 2v20"/><path d="M7 22h10"/><path d="M12 7V2l-4 4"/></svg>
              <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pointer-events-none">Bebidas</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <QtySelector label="Suco" value={drinks.suco} onDec={() => updateDrink('suco', -1)} onInc={() => updateDrink('suco', 1)} />
              <QtySelector label="Latinha" value={drinks.latinha} onDec={() => updateDrink('latinha', -1)} onInc={() => updateDrink('latinha', 1)} />
              <QtySelector label="Refri 1L" value={drinks.refri1l} onDec={() => updateDrink('refri1l', -1)} onInc={() => updateDrink('refri1l', 1)} />
              <QtySelector label="Refri 2L" value={drinks.refri2l} onDec={() => updateDrink('refri2l', -1)} onInc={() => updateDrink('refri2l', 1)} />
            </div>
          </div>
        </div>

        {/* Pagamento e Confirmação */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => setPaymentMethod('Pix')}
              className={`py-5 rounded-3xl border transition-all flex items-center justify-center gap-3 active:scale-95 ${
                paymentMethod === 'Pix' 
                ? 'bg-blue-600 border-blue-500 text-white font-black shadow-xl shadow-blue-900/40' 
                : 'bg-zinc-900/60 border-white/5 text-zinc-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              <span className="text-xs font-black uppercase tracking-widest">Pix</span>
            </button>
            <button 
              type="button" 
              onClick={() => setPaymentMethod('Dinheiro')}
              className={`py-5 rounded-3xl border transition-all flex items-center justify-center gap-3 active:scale-95 ${
                paymentMethod === 'Dinheiro' 
                ? 'bg-emerald-600 border-emerald-500 text-white font-black shadow-xl shadow-emerald-900/40' 
                : 'bg-zinc-900/60 border-white/5 text-zinc-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className="text-xs font-black uppercase tracking-widest">Dinheiro</span>
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full py-6 bg-white text-black rounded-full font-black text-xl uppercase tracking-tighter shadow-2xl active:scale-[0.98] transition-all hover:bg-zinc-100"
          >
            Finalizar Lançamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;
