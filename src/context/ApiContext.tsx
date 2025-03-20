
import React, { createContext, useContext, useState } from 'react';
import { authAPI, clienteAPI, compraAPI, resgateAPI } from '../services/api';
import { TokenDTO } from '../types';
import { toast } from 'sonner';

interface ApiContextType {
  isLoading: boolean;
  error: string | null;
  token: TokenDTO | null;
  loginCliente: (cpf: string, senha: string) => Promise<TokenDTO | null>;
  loginAdmin: (username: string, senha: string) => Promise<TokenDTO | null>;
  loginAdminLoja: (username: string, senha: string, codigoLoja: string) => Promise<TokenDTO | null>;
  logout: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<TokenDTO | null>(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? JSON.parse(savedToken) : null;
  });

  const handleApiCall = async <T,>(
    apiCall: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro na requisição';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCliente = async (cpf: string, senha: string): Promise<TokenDTO | null> => {
    const tokenResult = await handleApiCall(
      () => authAPI.loginCliente(cpf, senha),
      'Login realizado com sucesso!'
    );
    
    if (tokenResult) {
      setToken(tokenResult);
      localStorage.setItem('token', JSON.stringify(tokenResult));
    }
    
    return tokenResult;
  };

  const loginAdmin = async (username: string, senha: string): Promise<TokenDTO | null> => {
    const tokenResult = await handleApiCall(
      () => authAPI.loginAdmin(username, senha),
      'Login administrativo realizado com sucesso!'
    );
    
    if (tokenResult) {
      setToken(tokenResult);
      localStorage.setItem('token', JSON.stringify(tokenResult));
    }
    
    return tokenResult;
  };

  const loginAdminLoja = async (
    username: string, 
    senha: string, 
    codigoLoja: string
  ): Promise<TokenDTO | null> => {
    const tokenResult = await handleApiCall(
      () => authAPI.loginAdminLoja(username, senha, codigoLoja),
      'Login administrativo realizado com sucesso!'
    );
    
    if (tokenResult) {
      setToken(tokenResult);
      localStorage.setItem('token', JSON.stringify(tokenResult));
    }
    
    return tokenResult;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    toast.info('Sessão encerrada');
  };

  return (
    <ApiContext.Provider value={{
      isLoading,
      error,
      token,
      loginCliente,
      loginAdmin,
      loginAdminLoja,
      logout
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
