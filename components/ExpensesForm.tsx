
import React, { useState } from 'react';
import { Expense, ExpenseType } from '../types';

interface ExpensesFormProps {
  onAddExpense: (expense: Expense) => void;
}

const ExpensesForm: React.FC<ExpensesFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>('0,00');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<ExpenseType>(ExpenseType.GASTO);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue || '0', 10) / 100;
    
    setAmount(numericValue);
    setDisplayValue(numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) {
      alert("Preencha o valor e a descrição.");
      return;
    }

    onAddExpense({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      amount,
      description,
      type
    });

    setAmount(0);
    setDisplayValue('0,00');
    setDescription('');
    alert("Registro adicionado!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade" onKeyPress={(e) => { if(e.key === 'Enter') e.preventDefault(); }}>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white">Custos e Capital</h2>
        <div className="w-12 h-1 bg-yellow-400 rounded-full mt-2"></div>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900 rounded-2xl border border-white/5">
        <button 
          type="button" 
          onClick={() => setType(ExpenseType.CAPITAL)}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 ${type === ExpenseType.CAPITAL ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-900/20' : 'bg-transparent text-zinc-500'}`}
        >
          Capital Inicial
        </button>
        <button 
          type="button" 
          onClick={() => setType(ExpenseType.GASTO)}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 ${type === ExpenseType.GASTO ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-transparent text-zinc-500'}`}
        >
          Gasto Extra
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
          <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 pointer-events-none">O que foi pago?</label>
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-white/20 font-bold"
            placeholder="Ex: Carvão, Gelo, Aluguel..."
          />
        </div>

        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
          <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 text-center pointer-events-none">Valor do Lançamento</label>
          <div className="flex items-center justify-center">
             <span className="text-2xl font-black text-zinc-600 mr-2 opacity-40">R$</span>
             <input 
              type="text" 
              inputMode="numeric"
              value={displayValue} 
              onChange={handleValueChange}
              className="bg-transparent text-5xl font-black text-white outline-none w-64 text-center tracking-tighter"
              placeholder="0,00"
            />
          </div>
          <p className="text-[8px] text-zinc-700 font-bold uppercase text-center mt-3 italic pointer-events-none">Centavos obrigatórios e automáticos</p>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-white text-black p-6 rounded-full font-black text-lg uppercase shadow-2xl active:scale-[0.98] transition-all mt-4 active:bg-zinc-200"
      >
        Salvar Registro
      </button>
    </form>
  );
};

export default ExpensesForm;
