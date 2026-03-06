"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

function formatCentsBR(centsStr: string) {
  const digits = centsStr.replace(/\D/g, "");
  const n = digits.length ? Number(digits) : 0;

  const reais = Math.floor(n / 100);
  const centavos = (n % 100).toString().padStart(2, "0");

  return `${reais},${centavos}`;
}

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
};

export function InputCostCents({ value, onChange, placeholder }: Props) {
  const display = formatCentsBR(value);

  return (
    <Input
      inputMode="numeric"
      placeholder={placeholder ?? "0,00"}
      value={display}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "");
        if (digits.length > 10) return;
        onChange(digits);
      }}
    />
  );
}
