
import React from 'react';
import { Input } from '@/components/ui/input';
import { useCpfMask } from '@/hooks/useCpfMask';

interface CpfInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function CpfInput({ value, onChange, ...props }: CpfInputProps) {
  const cpfMask = useCpfMask(value);

  React.useEffect(() => {
    onChange(cpfMask.value);
  }, [cpfMask.value, onChange]);

  return (
    <Input
      {...props}
      value={cpfMask.formattedValue}
      onChange={cpfMask.handleChange}
      placeholder="000.000.000-00"
    />
  );
}
