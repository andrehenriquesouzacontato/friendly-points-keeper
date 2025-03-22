
import { useState, useEffect } from 'react';
import { formatarCPF } from '@/lib/utils';

export const useCpfMask = (initialValue: string = '') => {
  const [value, setValue] = useState(() => {
    // Garantir que o valor inicial seja apenas números
    return initialValue.replace(/\D/g, '');
  });
  
  const [formattedValue, setFormattedValue] = useState(() => formatarCPF(value));

  useEffect(() => {
    setFormattedValue(formatarCPF(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos para armazenar apenas os números
    const numericValue = e.target.value.replace(/\D/g, '');
    setValue(numericValue);
  };

  return {
    value,
    setValue,
    formattedValue,
    handleChange,
    inputProps: {
      value: formattedValue,
      onChange: handleChange,
    },
  };
};
