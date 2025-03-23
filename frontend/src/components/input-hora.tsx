import React from "react"
import InputMask from "react-input-mask"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils" // se usar função de classes

interface HoraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const InputHora = ({ value, onChange, error, className, ...props }: HoraInputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <InputMask
        mask="99:99"
        value={value}
        onChange={onChange}
        maskChar=""
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            {...props}
            className={cn("w-full", error && "border-red-500", className)}
            placeholder="00:00"
          />
        )}
      </InputMask>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}
