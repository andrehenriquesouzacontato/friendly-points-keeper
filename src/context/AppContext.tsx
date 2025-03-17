import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cliente, Compra, User, Resgate } from '../types';

interface AppContextType {
  clientes: Cliente[];
  compras: Compra[];
  user: User | null;
  resgates: Resgate[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'pontos' | 'dataRegistro' | 'senha'>) => void;
  getClienteByCpf: (cpf: string) => Cliente | undefined;
  registrarCompra: (clienteId: string, valor: number) => void;
  resgatarPontos: (clienteId: string, pontos: number, descricao: string) => boolean;
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
  
  const [resgates, setResgates] = useState<Resgate[]>(() => {
    const savedResgates = localStorage.getItem('resgates');
    return savedResgates ? JSON.parse(savedResgates) : [];
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
    localStorage.setItem('resgates', JSON.stringify(resgates));
  }, [resgates]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);
  
  const addCliente = (clienteData: Omit<Cliente, 'id' | 'pontos' | 'dataRegistro' | 'senha'>) => {
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
    const pontosGanhos = Math.floor(valor);
    
    const novaCompra: Compra = {
      id: Date.now().toString(),
      clienteId,
      valor,
      pontosGanhos,
      data: new Date().toISOString()
    };
    
    setCompras([...compras, novaCompra]);
    
    setClientes(prevClientes => 
      prevClientes.map(cliente => 
        cliente.id === clienteId 
          ? { ...cliente, pontos: cliente.pontos + pontosGanhos } 
          : cliente
      )
    );
  };
  
  const resgatarPontos = (clienteId: string, pontos: number, descricao: string) => {
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex === -1) {
      return false;
    }
    
    const cliente = clientes[clienteIndex];
    if (cliente.pontos < pontos) {
      return false;
    }
    
    const novoResgate: Resgate = {
      id: Date.now().toString(),
      clienteId,
      pontos,
      descricao,
      data: new Date().toISOString()
    };
    
    setResgates([...resgates, novoResgate]);
    
    setClientes(prevClientes => 
      prevClientes.map(c => 
        c.id === clienteId 
          ? { ...c, pontos: c.pontos - pontos } 
          : c
      )
    );
    
    return true;
  };
  
  const login = (username: string, password: string, tipo: 'admin' | 'cliente') => {
    if (tipo === 'admin') {
      if (username === 'Admin' && password === '1234') {
        setUser({ username, tipo: 'admin' });
        return true;
      }
    } else {
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
      resgates,
      user,
      addCliente,
      getClienteByCpf,
      registrarCompra,
      resgatarPontos,
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
