
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Retorna o início do dia de negócio (06:00 AM).
 * Se agora são 02:00 AM do dia 10, o dia de negócio ainda é o dia 09.
 */
export const getBusinessDayStart = (date: Date): number => {
  const d = new Date(date);
  // Se for antes das 6 da manhã, retrocede um dia no calendário
  if (d.getHours() < 6) {
    d.setDate(d.getDate() - 1);
  }
  d.setHours(6, 0, 0, 0);
  return d.getTime();
};

export const formatDate = (timestamp: number): string => {
  // Para exibição em relatórios, usamos a data do "dia de negócio"
  const d = new Date(timestamp);
  const displayDate = new Date(timestamp);
  if (d.getHours() < 6) {
    displayDate.setDate(d.getDate() - 1);
  }
  return displayDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDayStart = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const isSameDay = (t1: number, t2: number): boolean => {
  return getBusinessDayStart(new Date(t1)) === getBusinessDayStart(new Date(t2));
};

export const getCurrentWeekRange = () => {
  const now = new Date();
  const businessNow = new Date(now);
  if (now.getHours() < 6) businessNow.setDate(now.getDate() - 1);
  
  const day = businessNow.getDay(); // 0=Sun, 5=Fri, 6=Sat
  
  const friday = new Date(businessNow);
  const diffToFriday = (day < 5) ? (day + 2) : (day - 5);
  friday.setDate(businessNow.getDate() - diffToFriday);
  friday.setHours(6, 0, 0, 0);

  const monday = new Date(friday);
  monday.setDate(friday.getDate() + 3); // Vai até Segunda 05:59
  monday.setHours(5, 59, 59, 999);

  return { start: friday.getTime(), end: monday.getTime() };
};
