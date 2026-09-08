'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, searchKey } from '@/lib/utils';
import { hududBahosi } from '@/lib/hudud-qidiruv';
import { joyNomiTekshir } from '@/lib/inson-tekshiruvi';

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
  /** Tekshiruv xabarlarida ishlatiladigan maydon nomi */
  fieldLabel?: string;
  /** Qo'lda kiritilgan nom uchun uzunlik chegarasi */
  maxCustomLength?: number;
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
  fieldLabel = 'Nom',
  maxCustomLength = 120,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [customError, setCustomError] = React.useState<string | null>(null);

  const trimmed = query.trim();

  /** Yozilgan matn ro'yxatdagi variant bilan aynan mos keladimi? */
  const hasExactMatch = React.useMemo(
    () => options.some((o) => searchKey(o) === searchKey(trimmed)),
    [options, trimmed]
  );

  /**
   * So'rovga mos keladigan variantlar (eng mosi birinchi).
   *
   * Oddiy "ichida bormi?" tekshiruvi yetarli emasligi amalda
   * ko'rindi: "navruz" deb yozgan bola "Navro'z" ni topa olmasdi
   * va yangi mahalla yozib yuborardi.
   */
  const matches = React.useMemo(() => {
    const scored = options
      .map((o) => ({ o, score: hududBahosi(o, trimmed) }))
      .filter((x) => x.score > 0);
    scored.sort((a, b) => b.score - a.score || a.o.localeCompare(b.o));
    return scored.map((x) => x.o);
  }, [options, trimmed]);

  const showCustom = allowCustom && trimmed.length >= MIN_CUSTOM_LENGTH && !hasExactMatch;

  const select = (next: string) => {
    onChange(next);
    setQuery('');
    setCustomError(null);
    setOpen(false);
  };

  /**
   * Qo'lda yozilgan nomni qabul qilishdan oldin tekshiramiz.
   *
   * Bazada "sdfsdfds" kabi mahallalar paydo bo'lgani shundan edi:
   * ro'yxatdan topa olmagan bola qo'liga kelgan harflarni terib,
   * "qo'lda kiritish" tugmasini bosardi.
   */
  const selectCustom = () => {
    const natija = joyNomiTekshir(trimmed, fieldLabel, maxCustomLength);
    if (!natija.ok) {
      setCustomError(natija.xabar ?? `${fieldLabel} noto'g'ri`);
      return;
    }
    select(trimmed);
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
            !value && 'text-ink-faint',
            hasError && 'border-danger focus-visible:ring-danger',
            className
          )}
        >
          <span className="truncate text-left">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-ink-faint" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        {/*
          Filtrlashni Command emas, o'zimiz bajaramiz: moslashtirish
          fonetik va so'z bo'yicha ishlaydi, tayyor filtr esa faqat
          "ichida bormi?" ni biladi.
        */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              setCustomError(null);
            }}
          />
          <CommandList>
            {/* Qo'lda kiritish mumkin bo'lsa, "topilmadi" o'rniga
                taklif ko'rsatiladi — pastdagi guruhga qarang */}
            {!showCustom && matches.length === 0 && <CommandEmpty>{emptyText}</CommandEmpty>}

            <CommandGroup
              heading={
                trimmed && matches.length > 0 ? (
                  <span className="px-2 text-xs text-ink-faint">Shu emasmi?</span>
                ) : undefined
              }
            >
              {matches.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => select(option === value ? '' : option)}
                  className="items-start whitespace-normal"
                >
                  <Check
                    className={cn(
                      'mr-2 mt-0.5 h-4 w-4 shrink-0 text-accent',
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
                  <span className="px-2 text-xs text-ink-faint">
                    {matches.length > 0
                      ? "Yuqoridagilardan biri emasmi?"
                      : "Ro'yxatda topilmadimi?"}
                  </span>
                }
              >
                <CommandItem
                  value={`qolda-kiritish ${trimmed}`}
                  onSelect={selectCustom}
                  className="items-start whitespace-normal text-ink-muted"
                >
                  <PencilLine className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-snug">{customLabel(trimmed)}</span>
                </CommandItem>

                {customError && (
                  <p className="px-3 pb-2 text-xs leading-snug text-danger">{customError}</p>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
