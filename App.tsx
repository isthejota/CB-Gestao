
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import SalesForm from './components/SalesForm.tsx';
import ExpensesForm from './components/ExpensesForm.tsx';
import History from './components/History.tsx';
import Reports from './components/Reports.tsx';
import { AppTab, Sale, Expense } from './types.ts';
import { getSales, getExpenses, saveSales, saveExpenses } from './storage.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Initialize data
  useEffect(() => {
    setSales(getSales());
    setExpenses(getExpenses());
  }, []);

  // Save data on change
  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const handleAddSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    setActiveTab('dashboard');
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    setActiveTab('dashboard');
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard sales={sales} expenses={expenses} />
      )}
      {activeTab === 'vendas' && (
        <SalesForm onAddSale={handleAddSale} />
      )}
      {activeTab === 'gastos' && (
        <ExpensesForm onAddExpense={handleAddExpense} />
      )}
      {activeTab === 'historico' && (
        <History 
          sales={sales} 
          expenses={expenses} 
          onDeleteSale={handleDeleteSale} 
          onDeleteExpense={handleDeleteExpense} 
        />
      )}
      {activeTab === 'relatorios' && (
        <Reports sales={sales} expenses={expenses} />
      )}
    </Layout>
  );
};

export default App;
