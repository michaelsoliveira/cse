import React, { FocusEventHandler } from "react"
import { useMask } from '@react-input/mask'
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // se usar função de classes

interface HoraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  replacement?: any;
  className?: string;
}

export const InputMasked = React.forwardRef<HTMLInputElement, HoraInputProps>(
  ({ mask, value, onChange, replacement, error, onBlur, className, ...props }, ref) => {
    const inputRef = useMask({
      mask,
      replacement,
      showMask: true
    });

    return (
      <div className="flex flex-col space-y-1">    
          <Input
            value={value}
            onChange={onChange}
            className={cn("w-full", error && "border-red-500", className)}
            placeholder="00:00"
            ref={inputRef}
            {...props}
          />
      </div>
    )}
);

InputMasked.displayName = "InputMasked";
