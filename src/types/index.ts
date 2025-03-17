
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
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

export interface User {
  username: string;
  tipo: 'admin' | 'cliente';
  clienteId?: string;
}
