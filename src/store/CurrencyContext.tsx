import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencySymbol, setCurrencySymbol] = useState<string>(() => {
    return localStorage.getItem('currencySymbol') || '₱';
  });

  useEffect(() => {
    localStorage.setItem('currencySymbol', currencySymbol);
  }, [currencySymbol]);

  return (
    <CurrencyContext.Provider value={{ currencySymbol, setCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
