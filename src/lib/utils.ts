
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Valida um CPF verificando se está no formato correto e se os dígitos verificadores são válidos
 * @param cpf CPF a ser validado (pode conter pontuação)
 * @returns true se o CPF for válido, false caso contrário
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o primeiro dígito verificador
  if (parseInt(cpf.charAt(9)) !== dv1) {
    return false;
  }
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  
  // Verifica o segundo dígito verificador
  if (parseInt(cpf.charAt(10)) !== dv2) {
    return false;
  }
  
  return true;
}

/**
 * Formata um CPF adicionando pontos e traço
 * @param cpf CPF sem formatação
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatarCPF(cpf: string): string {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Limita a 11 dígitos
  cpf = cpf.slice(0, 11);
  
  // Adiciona a formatação
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
  }
}
