
import { useState, useEffect } from 'react';
import { formatarCPF } from '@/lib/utils';

export const useCpfMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(() => formatarCPF(initialValue));

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
