/**
 * ============================================================
 *  IKONA REYESTRI
 *
 *  Ilgari hamma joyda emoji ishlatilardi. Uch muammo bor edi:
 *    1. Eski Windows'da rangli emoji shrifti yo'q — kvadrat chiqadi
 *    2. Har bir platformada boshqacha ko'rinadi (Apple/Google/Microsoft)
 *    3. Vizual til izchil emas: ba'zisi rasm, ba'zisi belgi
 *
 *  Endi barchasi bitta uslubdagi chiziqli SVG (lucide-react).
 *  Ular shriftga bog'liq emas, har joyda bir xil va rangni
 *  `currentColor` dan oladi — ya'ni tema bilan birga o'zgaradi.
 * ============================================================
 */
import {
  Activity, Atom, Baby, BadgeCheck, Banknote, BookOpen, Brain, BrainCircuit,
  Briefcase, Brush, Building2, Calculator, ChefHat, Circle, Code2, Cog, Dna,
  Dumbbell, Flame, FlaskConical, Gamepad2, GraduationCap, HardHat, HeartPulse,
  Image as ImageIcon, Landmark, Languages, type LucideIcon, Medal, Mic,
  Microscope, Monitor, Music, Palette, PawPrint, Pill, Plane, Ruler, Scale,
  Scissors, ShieldCheck, Smartphone, Sparkles, Stethoscope, Syringe, TestTube,
  Tractor, Trophy, Users, Video, Wrench, Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* KASBLAR                                                             */
/* ------------------------------------------------------------------ */

export const JOB_ICONS: Record<string, LucideIcon> = {
  // IT & Texnologiya
  Dasturchi: Code2,
  "Sun'iy Intellekt mutaxassisi": BrainCircuit,
  'Kiberxavfsizlik mutaxassisi': ShieldCheck,
  'Grafik Dizayner': Palette,
  'Mobil ilova yaratuvchi': Smartphone,
  "O'yin yaratuvchi": Gamepad2,

  // Tibbiyot
  Shifokor: Stethoscope,
  Jarroh: HeartPulse,
  Stomatolog: Activity,
  Hamshira: Syringe,
  Psixolog: Brain,
  Farmatsevt: Pill,
  Veterinar: PawPrint,

  // Ta'lim & Ilm
  "O'qituvchi": GraduationCap,
  Olim: Microscope,
  Tarbiyachi: Baby,

  // Harbiy & Huquq
  'Harbiy xizmatchi': Medal,
  'IIB xodimi': BadgeCheck,
  Huquqshunos: Scale,
  'Qutqaruvchi (FVV)': Flame,

  // Muhandislik
  Muhandis: Cog,
  Arxitektor: Ruler,
  Quruvchi: HardHat,
  Elektrchi: Zap,
  Uchuvchi: Plane,

  // Ijodkorlik
  Rassom: Brush,
  Musiqachi: Music,
  Jurnalist: Mic,
  'Bloger/Youtuber': Video,
  Oshpaz: ChefHat,
  'Tikuvchi/Dizayner': Scissors,

  // Tadbirkorlik
  Fermer: Tractor,
  Tadbirkor: Briefcase,
  'Bank xodimi': Banknote,
  'Sportchi/Murabbiy': Trophy,
};

/* ------------------------------------------------------------------ */
/* KASB YO'NALISHLARI                                                  */
/* ------------------------------------------------------------------ */

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'IT & Texnologiya': Code2,
  Tibbiyot: Stethoscope,
  "Ta'lim & Ilm": GraduationCap,
  'Harbiy & Huquq': ShieldCheck,
  Muhandislik: Cog,
  Ijodkorlik: Palette,
  Tadbirkorlik: Briefcase,
};

/* ------------------------------------------------------------------ */
/* MAKTAB FANLARI                                                      */
/* ------------------------------------------------------------------ */

export const SUBJECT_ICONS: Record<string, LucideIcon> = {
  Matematika: Calculator,
  Fizika: Atom,
  Biologiya: Dna,
  Kimyo: TestTube,
  Tarix: Landmark,
  'Ona tili': BookOpen,
  'Ingliz tili': Languages,
  Informatika: Monitor,
  Sport: Dumbbell,
  Rasm: ImageIcon,
};

/* ------------------------------------------------------------------ */
/* TO'GARAKLAR                                                         */
/* ------------------------------------------------------------------ */

export const CLUB_ICONS: Record<string, LucideIcon> = {
  IT: Monitor,
  Sport: Dumbbell,
  Musiqa: Music,
  'Til kurslari': Languages,
  'Hech qaysi': Circle,
};

/* ------------------------------------------------------------------ */
/* KELAJAK SAVOLLARI                                                   */
/* ------------------------------------------------------------------ */

export const INSPIRATION_ICONS: Record<string, LucideIcon> = {
  'Otam/Onam': Users,
  "O'qituvchim": GraduationCap,
  Internet: Monitor,
  'Kitob/Qahramon': BookOpen,
};

export const ABROAD_ICONS: Record<string, LucideIcon> = {
  Ha: Plane,
  "Yo'q": Building2,
  "O'ylab ko'rmaganman": Sparkles,
};

/* ------------------------------------------------------------------ */
/* Yagona kirish nuqtasi                                               */
/* ------------------------------------------------------------------ */

/** Barcha reyestrlar — nom bo'yicha qidirish uchun */
const REGISTRIES = [
  JOB_ICONS,
  CATEGORY_ICONS,
  SUBJECT_ICONS,
  CLUB_ICONS,
  INSPIRATION_ICONS,
  ABROAD_ICONS,
];

/**
 * Nomga mos ikonani qaytaradi.
 *
 * Admin panel orqali yangi kasb qo'shilsa, u reyestrda bo'lmaydi —
 * shunday holatda zaxira ikona (Sparkles) qaytariladi, ya'ni
 * interfeys hech qachon bo'sh joy ko'rsatmaydi.
 */
export function iconFor(name: string, fallback: LucideIcon = Sparkles): LucideIcon {
  for (const registry of REGISTRIES) {
    const found = registry[name];
    if (found) return found;
  }
  return fallback;
}

interface EntityIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

/**
 * Nom bo'yicha ikona chizadi.
 * Rang `currentColor` dan olinadi — ota elementning matn rangi bilan
 * bir xil bo'ladi va tema almashganda o'zi moslashadi.
 */
export function EntityIcon({ name, className, strokeWidth = 1.75 }: EntityIconProps) {
  const Icon = iconFor(name);
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
