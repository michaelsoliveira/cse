'use client'

import { cn } from '@/lib/utils';
import AsyncSelect from 'react-select/async';
import { Label } from './ui/label';

interface State {
    readonly inputValue: string;
}

export interface OptionType {
    readonly label: string;
    readonly value: string | Number | undefined;
}

export type SelectType = {
  label?: string;
  onChange: (option: any) => void;
  defaultOptions?: OptionType[];
  placeholder?: string;
  value?: any;
  options?: any;
  isMulti?: boolean;
  initialData?: any;
  styleLabel?: string;
  selectStyle?: string;
  filterOption?: any;
}

export const SelectSearch = ({ label, onChange, options, defaultOptions, placeholder, styleLabel, filterOption, value, selectStyle, isMulti = false , initialData, ...props }: SelectType) => {
    return (
      <div>
        { label && (<Label className={cn("text-sm", styleLabel)} htmlFor="">{ label }</Label>) }
        <AsyncSelect
            isMulti={isMulti}
            loadOptions={options}
            filterOption={filterOption}
            className={cn("text-sm origin-top-right absolute right-0", selectStyle)}
            defaultOptions={defaultOptions}
            placeholder={placeholder}
            value={typeof value !== typeof undefined ? (Array.isArray(value) ? value?.map((data: any) => {
              return {
                label: data.label,
                value: data.value
              }
            }) : 
            value
              ) : initialData
            }
            onChange={onChange}
            theme={(theme: any) => ({
                ...theme,
                // borderRadius: 0,
                colors: {
                    ...theme.colors,
                    primary: 'rgb(83 114 53)',
                    primary75: 'rgb(109 128 58)',
                    primary50: 'rgb(158 179 132)',
                    primary25: 'rgb(206 222 189)',
                    },
                })
            }
            {...props}
        />
      </div>
    )
}
