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
import type { CSSProperties } from 'react';
import {
  Accessibility, Activity, Ambulance, Apple, Archive, Atom,
  Baby, BadgeCheck, Banknote, BarChart3, BatteryCharging, BedDouble,
  Bike, Bird, Blocks, BookMarked, BookOpen, Bot,
  Box, Boxes, Brain, BrainCircuit, Briefcase, Brush,
  Ban, Bug, Building2, Bus, CakeSlice, CalendarDays, Calculator, Camera,
  Car, CarTaxiFront, Carrot, ChefHat, Circle, Clapperboard,
  ClipboardCheck, ClipboardList, Code2, Coffee, Cog, Construction,
  Cpu, CreditCard, Croissant, Crown, Dna, Drama,
  Dribbble, Droplets, Dumbbell, Egg, Eye, Fan,
  FileCheck, FileSearch, FileText, Film, FireExtinguisher, Fish,
  Clock, Flag, Flame, FlaskConical, Flower, Flower2, Footprints, Frown,
  Fuel, Gamepad2, Gavel, Gem, Globe, GraduationCap,
  Hammer, HardHat, Headset, Heart, HeartHandshake, HeartPulse, HelpCircle, Home,
  Image, Landmark, Languages, LayoutTemplate, Leaf, Library,
  Laptop, ListChecks, Luggage, Mail, MapPinned, Medal, Megaphone, Moon,
  MessagesSquare, Mic, Microscope, Milk, Monitor, Mountain,
  Music, Music2, Network, Newspaper, PackageCheck, PackageSearch,
  Palette, PawPrint, PenLine, PenTool, Pencil, PersonStanding,
  Pickaxe, PieChart, PiggyBank, Pill, Plane, PlaneTakeoff,
  Radar, Receipt, Ruler, Scale, ScanLine, School,
  Scissors, ScrollText, Search, Shield, ShieldAlert, ShieldCheck,
  ShieldPlus, Shirt, ShoppingCart, Shovel, ShowerHead, Sigma,
  Smartphone, Sofa, Sparkles, SprayCan, Sprout, Stamp, Sun,
  Stethoscope, Store, Swords, Syringe, Target, Telescope,
  TestTube, Tractor, TrainFront, TreeDeciduous, TrendingUp, Trophy,
  Truck, Users, Utensils, Video, Volleyball, Volume2,
  Wand2, Warehouse, Waves, Wheat, Wifi, WifiOff, Worm, Wrench,
  Zap,
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
  'Tarbiyachi': Blocks,
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
  'Qutqaruvchi (FVV)': FireExtinguisher,
  'Chegarachi': Flag,
  'Sudya': Gavel,
  'Prokuror': ShieldAlert,
  'Advokat': BookMarked,
  'Tergovchi': Search,
  'Xavfsizlik xodimi': Shield,
  'Harbiy shifokor': ShieldPlus,
  'Notarius': Stamp,
  'Bojxona xodimi': PackageSearch,
  'Muhandis': Cog,
  'Arxitektor': Ruler,
  'Quruvchi': HardHat,
  'Elektrchi': Zap,
  'Uchuvchi': Plane,
  'Payvandchi': Flame,
  'Santexnik': ShowerHead,
  'Avtomobil ustasi': Wrench,
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
  'Tikuvchi/Dizayner': Shirt,
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
  'Pillachi': Worm,
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
  'Statistik': PieChart,
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
/* ---------- KERAKLI KURSLAR ---------- */
/*
 * 4-qadamdagi «qanday kurs ochilsa borar eding?» variantlari.
 * Ilgari bularning ko'pi reyestrda yo'q edi va ekranda bir xil
 * zaxira belgisi (uchqun) chiqardi — bola variantlarni bir-biridan
 * ajrata olmasdi.
 */
export const COURSE_ICONS: Record<string, LucideIcon> = {
  'Chet tili kursi': Languages,
  'Fizika va kimyo': FlaskConical,
  'Ona tili va adabiyot': BookOpen,
  'Grafik dizayn': Palette,
  'SMM va marketing': Megaphone,
  'Avtomobil ustaligi': Car,
  'Elektrik va payvandchilik': Zap,
  "Qishloq xo'jaligi": Sprout,
  'Rassomlik': Brush,
  'Notiqlik va liderlik': MessagesSquare,
  'Moliyaviy savodxonlik': PiggyBank,
};

/* ---------- MARKAZ SAVOLLARI ---------- */
/* Masofa, qulay vaqt va uydagi texnika javoblari */
export const CENTER_ICONS: Record<string, LucideIcon> = {
  'Faqat maktabimda': School,
  'Mahallamda': Home,
  "Qo'shni mahallaga ham": Footprints,
  'Tuman markazigacha': Bus,

  'Darsdan keyin (kunduzi)': Sun,
  'Kechqurun': Moon,
  'Dam olish kunlari': CalendarDays,
  "Yozgi ta'tilda": Waves,

  'Kompyuter ham, internet ham bor': Wifi,
  'Faqat telefon va internet bor': Smartphone,
  'Faqat kompyuter bor': Laptop,
  "Ikkalasi ham yo'q": WifiOff,
};

/* ---------- TO'SIQLAR ---------- */
/* «Nega to'garakka bormaysan?» javoblari — admin panelda ham chiqadi */
export const BARRIER_ICONS: Record<string, LucideIcon> = {
  "Yaqin atrofda bunday to'garak yo'q": Ban,
  'Uzoq, qatnash qiyin': MapPinned,
  "Oilaviy sharoitim yo'q": Home,
  'Ota-onam ruxsat bermaydi': ShieldAlert,
  "Uy ishlari ko'p, vaqtim yo'q": Clock,
  "Sog'lig'im imkon bermaydi": HeartPulse,
  'Nogironligim bor': Accessibility,
  "Kerakli kiyim yoki jihoz yo'q": Shirt,
  'Qiziqarli emas': Frown,
  'Boshqa sabab': HelpCircle,
  'Hech qaysi': Ban,
};

/* ---------- TILLAR ---------- */
/*
 * Chet tili kursini tanlagan bolaga chiqadigan variantlar.
 * Hammasi bitta ikona bilan: bayroq qo'yish mumkin emas (lucide da
 * bayroqlar yo'q), turli belgilar esa "koreys tili nega boshqacha
 * ko'rinyapti?" degan keraksiz savol tug'diradi.
 */
export const LANGUAGE_ICONS: Record<string, LucideIcon> = {
  'Ingliz tili': Languages,
  'Rus tili': Languages,
  'Koreys tili': Languages,
  'Turk tili': Languages,
  'Arab tili': Languages,
  'Xitoy tili': Languages,
  'Nemis tili': Languages,
};

const REGISTRIES = [
  JOB_ICONS,
  CATEGORY_ICONS,
  SUBJECT_ICONS,
  CLUB_ICONS,
  COURSE_ICONS,
  CENTER_ICONS,
  BARRIER_ICONS,
  LANGUAGE_ICONS,
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
  /** Ikona rangini tashqaridan berish uchun (masalan kasb rangi) */
  style?: CSSProperties;
}

/**
 * Nom bo'yicha ikona chizadi.
 * Rang `currentColor` dan olinadi — ota elementning matn rangi bilan
 * bir xil bo'ladi va tema almashganda o'zi moslashadi.
 */
export function EntityIcon({
  name,
  className,
  strokeWidth = 1.75,
  style,
}: EntityIconProps) {
  const Icon = iconFor(name);
  return (
    <Icon className={className} strokeWidth={strokeWidth} style={style} aria-hidden="true" />
  );
}
