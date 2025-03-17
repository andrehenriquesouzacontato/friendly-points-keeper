
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cliente, Compra, User } from '../types';

interface AppContextType {
  clientes: Cliente[];
  compras: Compra[];
  user: User | null;
  addCliente: (cliente: Omit<Cliente, 'id' | 'pontos' | 'dataRegistro'>) => void;
  getClienteByCpf: (cpf: string) => Cliente | undefined;
  registrarCompra: (clienteId: string, valor: number) => void;
  login: (username: string, password: string, tipo: 'admin' | 'cliente') => boolean;
  logout: () => void;
  clienteAtual: Cliente | null;
  setClienteAtual: (cliente: Cliente | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const savedClientes = localStorage.getItem('clientes');
    return savedClientes ? JSON.parse(savedClientes) : [];
  });
  
  const [compras, setCompras] = useState<Compra[]>(() => {
    const savedCompras = localStorage.getItem('compras');
    return savedCompras ? JSON.parse(savedCompras) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  
  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);
  
  useEffect(() => {
    localStorage.setItem('compras', JSON.stringify(compras));
  }, [compras]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);
  
  const addCliente = (clienteData: Omit<Cliente, 'id' | 'pontos' | 'dataRegistro'>) => {
    const newCliente: Cliente = {
      ...clienteData,
      id: Date.now().toString(),
      pontos: 0,
      dataRegistro: new Date().toISOString()
    };
    
    setClientes([...clientes, newCliente]);
  };
  
  const getClienteByCpf = (cpf: string) => {
    return clientes.find(cliente => cliente.cpf === cpf);
  };
  
  const registrarCompra = (clienteId: string, valor: number) => {
    // Arredondar para baixo para não dar pontos parciais
    const pontosGanhos = Math.floor(valor);
    
    const novaCompra: Compra = {
      id: Date.now().toString(),
      clienteId,
      valor,
      pontosGanhos,
      data: new Date().toISOString()
    };
    
    setCompras([...compras, novaCompra]);
    
    // Atualizar pontos do cliente
    setClientes(prevClientes => 
      prevClientes.map(cliente => 
        cliente.id === clienteId 
          ? { ...cliente, pontos: cliente.pontos + pontosGanhos } 
          : cliente
      )
    );
  };
  
  const login = (username: string, password: string, tipo: 'admin' | 'cliente') => {
    if (tipo === 'admin') {
      if (username === 'Admin' && password === '1234') {
        setUser({ username, tipo: 'admin' });
        return true;
      }
    } else {
      // Login de cliente com CPF
      const cliente = clientes.find(c => c.cpf === username && c.senha === password);
      if (cliente) {
        setUser({ 
          username: cliente.nome, 
          tipo: 'cliente',
          clienteId: cliente.id
        });
        return true;
      }
    }
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setClienteAtual(null);
  };
  
  return (
    <AppContext.Provider value={{
      clientes,
      compras,
      user,
      addCliente,
      getClienteByCpf,
      registrarCompra,
      login,
      logout,
      clienteAtual,
      setClienteAtual
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
