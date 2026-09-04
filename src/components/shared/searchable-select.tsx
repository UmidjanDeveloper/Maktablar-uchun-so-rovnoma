'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, searchKey } from '@/lib/utils';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Xatolik holatida chegara qizil rangda ko'rsatiladi */
  hasError?: boolean;
  id?: string;
  className?: string;
}

/**
 * Qidiruvli ochiluvchi ro'yxat (combobox).
 * 50 ta maktab yoki 34 ta mahalla ichidan tez topish uchun.
 * Qidiruv o'zbekcha apostroflarga befarq: "Bog'ishamol" ni "bogishamol"
 * deb yozib ham topish mumkin.
 */
export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Tanlang',
  searchPlaceholder = 'Qidirish...',
  emptyText = 'Hech narsa topilmadi',
  hasError = false,
  id,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-12 w-full justify-between px-4 text-base font-normal',
            !value && 'text-slate-400',
            hasError && 'border-red-400 focus-visible:ring-red-100',
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(itemValue, search) =>
            searchKey(itemValue).includes(searchKey(search)) ? 1 : 0
          }
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option === value ? '' : option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 text-brand-600',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
