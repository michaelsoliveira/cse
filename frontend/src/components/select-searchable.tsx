"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface OptionType {
    readonly label: string;
    readonly value: string | number;
}


export type SelectItemsProps = {
    // label?: string;
    callback: (option: any) => void;
    placeholder?: string;
    field?: any;
    options?: OptionType[] | null;
    // isMulti?: boolean;
    // initialData?: any;
    // styleLabel?: string;
    selectStyle?: string;
    // filterOption?: any;
}

export function SelectSearchable({ 
    callback,
    placeholder,
    field,
    selectStyle,
    options
} : SelectItemsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[300px] justify-between",
            !field && "text-muted-foreground",
            selectStyle
          )}
        >
          {field?.value
            ? options?.find((option: OptionType) => option.value === field.value)?.label
            : "Selecione um Item"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[300px] p-0", selectStyle)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup>
              {options?.map((option: OptionType) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    callback(option)  
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field?.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
