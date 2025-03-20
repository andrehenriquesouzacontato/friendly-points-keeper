
import { TokenDTO } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7212/api';

// Função auxiliar para obter o token do localStorage
const getToken = (): string | null => {
  const tokenData = localStorage.getItem('token');
  if (!tokenData) return null;
  
  try {
    const token: TokenDTO = JSON.parse(tokenData);
    return token.accessToken;
  } catch {
    return null;
  }
};

// Configuração padrão para requisições
const configureRequest = (method: string, data?: any): RequestInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include'
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  return config;
};

// Função genérica para requisições
const fetchAPI = async <T>(endpoint: string, method: string, data?: any): Promise<T> => {
  const config = configureRequest(method, data);
  const response = await fetch(`${API_URL}/${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || `Erro ${response.status}`);
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  loginCliente: (cpf: string, senha: string) => 
    fetchAPI<TokenDTO>('auth/login/cliente', 'POST', { cpf, senha }),
    
  loginAdmin: (username: string, senha: string) => 
    fetchAPI<TokenDTO>('auth/login/admin', 'POST', { username, senha }),
    
  loginAdminLoja: (username: string, senha: string, codigoLoja: string) => 
    fetchAPI<TokenDTO>('auth/login/admin/loja', 'POST', { username, senha, codigoLoja })
};

// Cliente API
export const clienteAPI = {
  getAll: () => fetchAPI('clientes', 'GET'),
  getByCPF: (cpf: string) => fetchAPI(`clientes/cpf/${cpf}`, 'GET'),
  getById: (id: string) => fetchAPI(`clientes/${id}`, 'GET'),
  create: (cliente: any) => fetchAPI('clientes', 'POST', cliente)
};

// Compra API
export const compraAPI = {
  getAll: () => fetchAPI('compras', 'GET'),
  getByClienteId: (clienteId: string) => fetchAPI(`compras/cliente/${clienteId}`, 'GET'),
  create: (compra: any) => fetchAPI('compras', 'POST', compra)
};

// Resgate API
export const resgateAPI = {
  getAll: () => fetchAPI('resgates', 'GET'),
  getByClienteId: (clienteId: string) => fetchAPI(`resgates/cliente/${clienteId}`, 'GET'),
  create: (resgate: any) => fetchAPI('resgates', 'POST', resgate)
};
