import React, { FocusEventHandler } from "react"
import InputMask from "react-input-mask"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // se usar função de classes

interface HoraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  className?: string;
}

export const InputHora = React.forwardRef<HTMLInputElement, HoraInputProps>(
  ({ value, onChange, error, onBlur, className, ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1">
      <InputMask
        mask="00:00"
        value={value}
        onChange={onChange}
        maskChar=""
        disabled={false}
        onBlur={onBlur}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            {...props}
            className={cn("w-full", error && "border-red-500", className)}
            placeholder="00:00"
            disabled={false}
          />
        )}
      </InputMask>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )}
);

InputHora.displayName = "InputHora";
