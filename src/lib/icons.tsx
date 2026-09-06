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
 *
 *  DIQQAT: bu fayl `src/lib/constants.ts` bilan qo'lda sinxron
 *  turadi. Yangi kasb, fan yoki to'garak qo'shsangiz, shu yerga ham
 *  ikona qo'shing — aks holda zaxira ikona (Sparkles) ko'rinadi.
 * ============================================================
 */
import {
  Accessibility, Activity, Ambulance, Apple, Archive, Atom,
  Baby, BadgeCheck, Banknote, BarChart3, BatteryCharging, BedDouble,
  Bike, Bird, BookMarked, BookOpen, Bot, Box,
  Boxes, Brain, BrainCircuit, Briefcase, Brush, Bug,
  Building2, Bus, CakeSlice, Calculator, Camera, Car,
  CarTaxiFront, Carrot, ChefHat, Circle, Clapperboard, ClipboardCheck,
  ClipboardList, Code2, Coffee, Cog, Construction, Cpu,
  CreditCard, Croissant, Crown, Dna, Drama, Dribbble,
  Droplets, Dumbbell, Egg, Eye, Fan, FileCheck,
  FileSearch, FileText, Film, Fish, Flag, Flame,
  FlaskConical, Flower, Flower2, Footprints, Fuel, Gamepad2,
  Gavel, Gem, Globe, GraduationCap, Hammer, HardHat,
  Headset, Heart, HeartHandshake, HeartPulse, Image, Landmark,
  Languages, LayoutTemplate, Leaf, Library, ListChecks, Luggage,
  Mail, MapPinned, Medal, Megaphone, MessagesSquare, Mic,
  Microscope, Milk, Monitor, Mountain, Music, Music2,
  Network, Newspaper, PackageCheck, PackageSearch, Palette, PawPrint,
  PenLine, PenTool, Pencil, PersonStanding, Pickaxe, PiggyBank,
  Pill, Plane, PlaneTakeoff, Radar, Receipt, Ruler,
  Scale, ScanLine, School, Scissors, ScrollText, Search,
  Shield, ShieldAlert, ShieldCheck, ShoppingCart, Shovel, Sigma,
  Smartphone, Sofa, Sparkles, SprayCan, Sprout, Stamp,
  Stethoscope, Store, Swords, Syringe, Target, Telescope,
  TestTube, Tractor, TrainFront, TreeDeciduous, TrendingUp, Trophy,
  Truck, Users, Utensils, Video, Volleyball, Volume2,
  Wand2, Warehouse, Waves, Wheat, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

/* ---------- KASBLAR ---------- */
export const JOB_ICONS: Record<string, LucideIcon> = {
  'Dasturchi': Code2,
  "Sun'iy Intellekt mutaxassisi": BrainCircuit,
  'Kiberxavfsizlik mutaxassisi': ShieldCheck,
  'Grafik Dizayner': Palette,
  'Mobil ilova yaratuvchi': Smartphone,
  "O'yin yaratuvchi": Gamepad2,
  'Veb-dasturchi': LayoutTemplate,
  "Ma'lumotlar tahlilchisi": BarChart3,
  'Tarmoq muhandisi': Network,
  'Robototexnik': Bot,
  '3D modelchi': Box,
  'Dastur sinovchisi (QA)': Bug,
  'Kompyuter ustasi': Cpu,
  'Dron uchuvchisi': Radar,
  'Shifokor': Stethoscope,
  'Jarroh': HeartPulse,
  'Stomatolog': Activity,
  'Hamshira': Syringe,
  'Psixolog': Brain,
  'Farmatsevt': Pill,
  'Veterinar': PawPrint,
  'Pediatr': Baby,
  'Kardiolog': Heart,
  "Ko'z shifokori": Eye,
  'Laborant': TestTube,
  'Rentgenolog': ScanLine,
  'Tez yordam feldsheri': Ambulance,
  'Reabilitolog': Accessibility,
  'Dietolog': Apple,
  "O'qituvchi": GraduationCap,
  'Olim': Microscope,
  'Tarbiyachi': Baby,
  "Boshlang'ich sinf o'qituvchisi": Pencil,
  'Maktab direktori': School,
  'Kutubxonachi': Library,
  'Tarjimon': Languages,
  'Arxeolog': Shovel,
  'Geolog': Mountain,
  'Astronom': Telescope,
  'Matematik': Sigma,
  'Biolog': Dna,
  'Tarixchi': ScrollText,
  'Harbiy xizmatchi': Medal,
  'IIB xodimi': BadgeCheck,
  'Huquqshunos': Scale,
  'Qutqaruvchi (FVV)': Flame,
  'Chegarachi': Flag,
  'Sudya': Gavel,
  'Prokuror': ShieldAlert,
  'Advokat': BookMarked,
  'Tergovchi': Search,
  'Xavfsizlik xodimi': Shield,
  'Harbiy shifokor': Stethoscope,
  'Notarius': Stamp,
  'Bojxona xodimi': PackageSearch,
  'Muhandis': Cog,
  'Arxitektor': Ruler,
  'Quruvchi': HardHat,
  'Elektrchi': Zap,
  'Uchuvchi': Plane,
  'Payvandchi': Flame,
  'Santexnik': Wrench,
  'Avtomobil ustasi': Car,
  'Energetik': BatteryCharging,
  'Neft va gaz muhandisi': Fuel,
  'Kon muhandisi': Pickaxe,
  'Konstruktor': PenTool,
  "Suv xo'jaligi muhandisi": Waves,
  "Yo'l qurilishi muhandisi": Construction,
  'Iqlim texnikasi ustasi': Fan,
  'Rassom': Brush,
  'Musiqachi': Music,
  'Jurnalist': Mic,
  'Bloger/Youtuber': Video,
  'Oshpaz': ChefHat,
  'Tikuvchi/Dizayner': Scissors,
  'Fotograf': Camera,
  'Video montajchi': Clapperboard,
  'Aktyor': Drama,
  'Rejissyor': Film,
  'Yozuvchi/Shoir': PenLine,
  'Xonanda': Music2,
  'Raqqosa': PersonStanding,
  'Interyer dizayneri': Sofa,
  'Animator': Wand2,
  'Ovoz rejissyori': Volume2,
  'SMM mutaxassisi': Megaphone,
  'Fermer': Tractor,
  'Tadbirkor': Briefcase,
  'Bank xodimi': Banknote,
  'Sportchi/Murabbiy': Trophy,
  'Buxgalter': Calculator,
  'Iqtisodchi': TrendingUp,
  'Marketolog': Target,
  'Menejer': ClipboardList,
  'Savdo mutaxassisi': ShoppingCart,
  'Auditor': FileSearch,
  "Sug'urta agenti": FileCheck,
  'Investor': PiggyBank,
  'Loyiha rahbari': ListChecks,
  'Agronom': Sprout,
  'Chorvador': Milk,
  "Bog'bon": TreeDeciduous,
  'Pillachi': Bug,
  'Asalarichi': Flower2,
  'Paxtakor': Flower,
  'Sabzavotchi': Carrot,
  'Mexanizator': Tractor,
  "Suv xo'jaligi mutaxassisi": Droplets,
  'Baliqchi': Fish,
  'Parrandachi': Egg,
  'Zootexnik': Bird,
  'Issiqxona egasi': Warehouse,
  "Don va g'alla mutaxassisi": Wheat,
  'Haydovchi': Car,
  'Yuk mashinasi haydovchisi': Truck,
  "Temiryo'l mashinisti": TrainFront,
  'Avtobus haydovchisi': Bus,
  'Taksi haydovchisi': CarTaxiFront,
  'Logistika menejeri': PackageCheck,
  'Ombor mudiri': Boxes,
  'Kuryer': Bike,
  'Dispetcher': Headset,
  'Aviatsiya texnigi': PlaneTakeoff,
  'Yuk qabul qiluvchi': ClipboardCheck,
  'Ofitsiant': Utensils,
  'Barista': Coffee,
  'Qandolatchi': CakeSlice,
  'Novvoy': Croissant,
  'Sartarosh': Scissors,
  'Kosmetolog': Gem,
  'Mehmonxona administratori': BedDouble,
  "Gid (yo'lboshchi)": MapPinned,
  'Turizm menejeri': Luggage,
  'Sotuvchi': Store,
  'Kassir': CreditCard,
  'Tozalash xizmati xodimi': SprayCan,
  'Davlat xizmatchisi': Landmark,
  'Hokim yordamchisi': Building2,
  'Mahalla raisi': Users,
  'Diplomat': Globe,
  'Statistik': BarChart3,
  'Soliq inspektori': Receipt,
  'Ijtimoiy xodim': HeartHandshake,
  'Ekolog': Leaf,
  'Arxivchi': Archive,
  'Pochta xodimi': Mail,
  'FHDYo xodimi': FileText,
};

/* ---------- KASB YO'NALISHLARI ---------- */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'IT & Texnologiya': Code2,
  'Tibbiyot': Stethoscope,
  "Ta'lim & Ilm": GraduationCap,
  'Harbiy & Huquq': ShieldCheck,
  'Muhandislik': Cog,
  'Ijodkorlik': Palette,
  'Tadbirkorlik': Briefcase,
  "Qishloq xo'jaligi": Wheat,
  'Transport & Logistika': Truck,
  "Xizmat ko'rsatish": Utensils,
  'Davlat xizmati': Landmark,
};

/* ---------- MAKTAB FANLARI ---------- */
export const SUBJECT_ICONS: Record<string, LucideIcon> = {
  'Matematika': Calculator,
  'Algebra': Sigma,
  'Geometriya': Ruler,
  'Fizika': Atom,
  'Astronomiya': Telescope,
  'Informatika': Monitor,
  'Kimyo': TestTube,
  'Biologiya': Dna,
  'Geografiya': Globe,
  'Tarix': Landmark,
  'Huquq asoslari': Scale,
  'Iqtisodiyot asoslari': TrendingUp,
  'Tarbiya': HeartHandshake,
  'Ona tili': BookOpen,
  'Adabiyot': BookMarked,
  'Ingliz tili': Languages,
  'Rus tili': Languages,
  'Chizmachilik': PenTool,
  'Texnologiya': Wrench,
  'Rasm': Image,
  'Musiqa': Music,
  'Sport': Dumbbell,
};

/* ---------- TO'GARAKLAR ---------- */
export const CLUB_ICONS: Record<string, LucideIcon> = {
  'Futbol': Trophy,
  'Voleybol': Volleyball,
  'Basketbol': Dribbble,
  'Kurash': Swords,
  'Boks': Swords,
  'Karate / Taekvondo': Swords,
  'Stol tennisi': Target,
  'Yengil atletika': Footprints,
  'Shaxmat': Crown,
  'Dasturlash': Code2,
  'Robototexnika': Bot,
  "Matematika to'garagi": Calculator,
  "Fizika-kimyo to'garagi": FlaskConical,
  'Biologiya va ekologiya': Leaf,
  'Ingliz tili kursi': Languages,
  'Rus tili kursi': Languages,
  'Boshqa chet tili': Globe,
  'Musiqa': Music,
  'Ashula': Mic,
  'Raqs': PersonStanding,
  'Teatr': Drama,
  'Rassomlik': Brush,
  'Hunarmandchilik': Hammer,
  'Tikuvchilik': Scissors,
  'Oshpazlik': ChefHat,
  'Jurnalistika': Newspaper,
  'Notiqlik va debat': MessagesSquare,
  'Harbiy-vatanparvarlik': Medal,
  'Volontyorlik': HeartHandshake,
  'Hech qaysi': Circle,
};

/* ---------- KELAJAK SAVOLLARI ---------- */
export const INSPIRATION_ICONS: Record<string, LucideIcon> = {
  'Otam/Onam': Users,
  "O'qituvchim": GraduationCap,
  'Internet': Monitor,
  'Kitob/Qahramon': BookOpen,
};


export const ABROAD_ICONS: Record<string, LucideIcon> = {
  'Ha': Plane,
  "Yo'q": Building2,
  "O'ylab ko'rmaganman": Sparkles,
};

/* ------------------------------------------------------------------ */
/* Yagona kirish nuqtasi                                               */
/* ------------------------------------------------------------------ */

/**
 * Barcha reyestrlar — nom bo'yicha qidirish uchun.
 * Tartib muhim: bir xil nom (masalan «Musiqa») ham fanda, ham
 * to'garakda uchraydi; birinchi mos kelgani ishlatiladi.
 */
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
