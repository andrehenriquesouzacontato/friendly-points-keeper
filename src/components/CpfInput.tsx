
import React from 'react';
import { Input } from '@/components/ui/input';
import { useCpfMask } from '@/hooks/useCpfMask';

interface CpfInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function CpfInput({ value, onChange, ...props }: CpfInputProps) {
  const cpfMask = useCpfMask(value);

  // Atualizar o valor do parent apenas quando o valor mudar, não no render inicial
  React.useEffect(() => {
    // Importante: chamar o onChange apenas se o valor for diferente
    // para evitar loops infinitos
    if (cpfMask.value !== value.replace(/\D/g, '')) {
      onChange(cpfMask.value);
    }
  }, [cpfMask.value, value, onChange]);

  return (
    <Input
      {...props}
      value={cpfMask.formattedValue}
      onChange={cpfMask.handleChange}
      placeholder="000.000.000-00"
    />
  );
}
