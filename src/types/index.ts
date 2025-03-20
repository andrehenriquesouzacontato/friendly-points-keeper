export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string | null | "";
  telefone: string;
  senha?: string;
  pontos: number;
  dataRegistro: string;
}

export interface Compra {
  id: string;
  clienteId: string;
  valor: number;
  pontosGanhos: number;
  data: string;
}

export interface Resgate {
  id: string;
  clienteId: string;
  pontos: number;
  descricao: string;
  data: string;
}

export interface User {
  username: string;
  tipo: 'admin' | 'cliente';
  clienteId?: string;
}

export interface TokenDTO {
  accessToken: string;
  expiration: string;
  userType: string;
  userName: string;
  clienteId?: string;
}
