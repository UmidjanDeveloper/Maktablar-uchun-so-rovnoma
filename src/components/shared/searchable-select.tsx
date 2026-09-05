'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, searchKey } from '@/lib/utils';

/** Qo'lda kiritish uchun eng kam belgilar soni */
const MIN_CUSTOM_LENGTH = 2;

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
  /**
   * Ro'yxatda mos variant bo'lmasa, foydalanuvchi o'zi yozgan matnni
   * qiymat sifatida tanlashi mumkin. Yangi mahalla yoki ro'yxatga
   * kiritilmagan maktab uchun kerak.
   */
  allowCustom?: boolean;
  /** Qo'lda kiritish taklifining matni */
  customLabel?: (query: string) => string;
}

/**
 * Qidiruvli ochiluvchi ro'yxat (combobox).
 *
 * Qidiruv apostrof, defis va bo'shliqqa befarq: "bogishamol" deb yozib
 * "Bog'ishamol" ni, "oqoltin" deb "Oq-oltin" ni topish mumkin.
 *
 * `allowCustom` yoqilganda, ro'yxatda mos variant topilmasa o'quvchi
 * o'z variantini yozib qo'shishi mumkin — shunda hech kim anketani
 * to'ldirmasdan ketib qolmaydi.
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
  allowCustom = false,
  customLabel = (q) => `«${q}» ni qo'lda kiritish`,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const trimmed = query.trim();

  /** Yozilgan matn ro'yxatdagi variant bilan aynan mos keladimi? */
  const hasExactMatch = React.useMemo(
    () => options.some((o) => searchKey(o) === searchKey(trimmed)),
    [options, trimmed]
  );

  const showCustom = allowCustom && trimmed.length >= MIN_CUSTOM_LENGTH && !hasExactMatch;

  const select = (next: string) => {
    onChange(next);
    setQuery('');
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
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
          <span className="truncate text-left">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(itemValue, search) =>
            searchKey(itemValue).includes(searchKey(search)) ? 1 : 0
          }
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {/* Qo'lda kiritish mumkin bo'lsa, "topilmadi" o'rniga
                taklif ko'rsatiladi — pastdagi guruhga qarang */}
            {!showCustom && <CommandEmpty>{emptyText}</CommandEmpty>}

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => select(option === value ? '' : option)}
                  className="items-start whitespace-normal"
                >
                  <Check
                    className={cn(
                      'mr-2 mt-0.5 h-4 w-4 shrink-0 text-brand-600',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="leading-snug">{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {showCustom && (
              <CommandGroup
                heading={
                  <span className="px-2 text-xs text-slate-400">
                    Ro&apos;yxatda topilmadimi?
                  </span>
                }
              >
                <CommandItem
                  value={`qolda-kiritish ${trimmed}`}
                  onSelect={() => select(trimmed)}
                  className="items-start whitespace-normal text-brand-700"
                >
                  <PencilLine className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="font-semibold leading-snug">
                    {customLabel(trimmed)}
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
