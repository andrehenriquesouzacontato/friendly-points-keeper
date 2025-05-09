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
  adminLoginWithStoreCode: (username: string, password: string, storeCode: string) => boolean;
  logout: () => void;
  clienteAtual: Cliente | null;
  setClienteAtual: (cliente: Cliente | null) => void;
  storeLocation: { latitude: number; longitude: number };
  storeCode: string;
  excluirCliente: (clienteId: string) => boolean;
  atualizarSenhaCliente: (clienteId: string, novaSenha: string) => boolean;
}

const STORE_LOCATION = {
  latitude: -23.550520,
  longitude: -46.633308,
};

const STORE_CODE = "LOJA123";

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

  const adminLoginWithStoreCode = (username: string, password: string, storeCode: string): boolean => {
    if (username === 'Admin' && password === '1234' && storeCode === STORE_CODE) {
      setUser({ username, tipo: 'admin' });
      return true;
    }
    return false;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

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
    const numericCpf = cpf.replace(/\D/g, '');
    return clientes.find(cliente => cliente.cpf.replace(/\D/g, '') === numericCpf);
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
      const cpfNormalizado = username.replace(/\D/g, '');
      console.log('Login attempt for CPF:', cpfNormalizado);
      
      const cliente = clientes.find(c => {
        const clienteCpfNormalizado = c.cpf.replace(/\D/g, '');
        console.log('Comparing with client:', clienteCpfNormalizado, 'Password:', c.senha);
        return clienteCpfNormalizado === cpfNormalizado && c.senha === password;
      });
      
      if (cliente) {
        console.log('Login successful for client:', cliente.nome);
        setUser({ 
          username: cliente.nome, 
          tipo: 'cliente',
          clienteId: cliente.id
        });
        return true;
      }
    }
    console.log('Login failed');
    return false;
  };
  
  const atualizarSenhaCliente = (clienteId: string, novaSenha: string): boolean => {
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex === -1) {
      return false;
    }
    
    const clientesAtualizados = clientes.map(c => {
      if (c.id === clienteId) {
        return { ...c, senha: novaSenha };
      }
      return c;
    });
    
    setClientes(clientesAtualizados);
    return true;
  };
  
  const logout = () => {
    setUser(null);
    setClienteAtual(null);
  };

  const excluirCliente = (clienteId: string): boolean => {
    const clienteIndex = clientes.findIndex(c => c.id === clienteId);
    if (clienteIndex === -1) {
      return false;
    }
    
    const temCompras = compras.some(c => c.clienteId === clienteId);
    const temResgates = resgates.some(r => r.clienteId === clienteId);
    
    if (temCompras || temResgates) {
      return false;
    }
    
    setClientes(prevClientes => prevClientes.filter(c => c.id !== clienteId));
    
    if (clienteAtual && clienteAtual.id === clienteId) {
      setClienteAtual(null);
    }
    
    return true;
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
      adminLoginWithStoreCode,
      logout,
      clienteAtual,
      setClienteAtual,
      storeLocation: STORE_LOCATION,
      storeCode: STORE_CODE,
      excluirCliente,
      atualizarSenhaCliente
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
