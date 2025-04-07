export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // Format for Brazilian Portuguese
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    
    return date.toLocaleDateString('pt-BR', options);
  };
  
  export const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    // Format for Brazilian Portuguese
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  export const formatDateTime = (timestamp: number): string => {
    return `${formatDate(timestamp)} às ${formatTime(timestamp)}`;
  };
  
  export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  export const getStartOfDay = (date: Date): Date => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  };
  
  export const getEndOfDay = (date: Date): Date => {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  };
  
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  };
  
  export const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };