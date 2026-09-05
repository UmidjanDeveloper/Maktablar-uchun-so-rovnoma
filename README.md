# 🎓 Kelajak Egasi — Xatirchi Tuman Kasb Platformasi

Navoiy viloyati Xatirchi tumani maktab o'quvchilarining (5–11-sinf) orzu qilgan
kasblari va qiziqishlarini yig'ib, tuman hokimligiga aniq ma'lumotga asoslangan
qaror qabul qilish imkonini beruvchi veb-platforma.

> **Misol:** Agar Oqoltin mahallasidagi qizlarning 60% i shifokor bo'lishni
> orzu qilsa — o'sha mahallada tibbiyot to'garagini ochish maqsadga muvofiq.

Ilova ikki qismdan iborat:

| Qism | Manzil | Kim uchun |
|------|--------|-----------|
| **Anketa** (login talab qilinmaydi) | `/` | Maktab o'quvchilari — kompyuter sinfida kiosk rejimida |
| **Tahlil paneli** | `/admin/dashboard` | Tuman hokimligi xodimlari |
| **Sozlamalar** | `/admin/settings` | Mahalla / maktab / kasb ro'yxatlarini boshqarish |

---

## ✨ Asosiy imkoniyatlar

### O'quvchilar uchun anketa
- **4 ta qadam:** shaxsiy ma'lumot → qiziqishlar → orzu kasb → kelajak rejalari
- **Loginsiz** — o'quvchi kompyuter oldiga o'tiradi va darhol to'ldiradi
- **Kiosk rejimi** — anketa yuborilgandan so'ng ekran 7 soniyada avtomatik
  tozalanadi va keyingi o'quvchini kutadi
- **Qidiruvli ro'yxatlar** — 70 ta mahalla va 50 ta maktab ichidan tez topish.
  Qidiruv apostrof, defis va bo'shliqqa befarq: `bogishamol` →
  **Bog'ishamol**, `oqoltin` → **Oq-oltin**, `karvon` → **Ikrom Karvon**
- **35 ta kasb** yirik, emoji bilan bezatilgan kartochkalarda — 7 ta yo'nalish bo'yicha
- **Konfetti animatsiyasi** va shaxsiy tabrik: *«Rahmat, Zilola! Sen kelajakda
  ajoyib Shifokor bo'lasan!»*
- **Oflayn rejim** — internet uzilsa anketa brauzerda saqlanadi va aloqa
  tiklanishi bilan avtomatik yuboriladi (maktab internetlari uchun muhim)

### Hokimiyat uchun tahlil paneli
- **5 ta KPI:** jami o'quvchilar, maktablar, mahallalar, qizlar %, o'g'il bolalar %
- **Global filtrlar:** mahalla, maktab, sinf, jins, kasb yo'nalishi, sana oralig'i.
  Filtr o'zgarganda **barcha diagrammalar** bir vaqtda yangilanadi
- **6 ta tahlil bloki:**
  1. Top 10 kasblar (vertikal ustunli diagramma)
  2. Qizlar va o'g'il bolalar tanlovi (guruhlangan ustunli diagramma)
  3. Mahalla bo'yicha qiziqish (gorizontal ustunli diagramma)
  4. Maktab bo'yicha eng ommabop kasb (jadval)
  5. Sinflar bo'yicha taqsimot (doiraviy diagramma)
  6. Fanlar bo'yicha qiziqish (doiraviy diagramma)
- **Tavsiyalar paneli** — diagrammalar "nima bo'lyapti" desa, bu panel
  "endi nima qilish kerak" deydi. Har bir tavsiya raqamli dalil bilan:
  *«Oqoltin mahallasida IT markazi ochish — 12 ta o'quvchidan 6 tasi (50%)
  shu yo'nalishni tanlagan»*
- **Anketalar jadvali:** qidiruv, sahifalash, qatorni bosganda to'liq ma'lumot oynasi
- **Excelga yuklash** — filtrlangan ma'lumotlar 3 ta varaqda
  (Anketalar / Statistika / Hududlar)
- **PDF hisobot** — hokim uchun tayyor, chop etishga yaroqli tahliliy hujjat:
  KPI, diagrammalar, maktablar jadvali va muhimlik darajasi bo'yicha
  tartiblangan tavsiyalar

### Texnik jihatlar
- **PWA** — ilovani kompyuterga o'rnatish va oflayn ishlatish mumkin
- **Eski kompyuterlar uchun optimallashtirilgan** — og'ir kutubxonalar
  (`xlsx`, `jspdf`) faqat kerak bo'lganda yuklanadi
- **Takroriy anketa himoyasi** — bir xil (ism + familiya + maktab + sinf +
  telefon) 24 soat ichida qayta topshirilmaydi. Telefon raqami kalitga
  kiritilgani uchun bir sinfdagi ikkita bir xil ismli o'quvchi bir-birini
  bloklamaydi. Ma'lumotlar bazasi darajasidagi cheklov parallel
  so'rovlarda ham dublikat yaratilishiga yo'l qo'ymaydi
- **Tezlik chegarasi (rate limit)** — bitta IP manzildan bir daqiqada
  5 tadan ko'p anketa qabul qilinmaydi (F5 ni bosaverishdan himoya)
- **Xavfsizlik qulfi** — standart parol o'zgartirilmasa, tizim
  production rejimida admin panelga kirishni butunlay bloklaydi
- **Rang ko'rmaslik (CVD) uchun tekshirilgan** diagramma ranglari;
  har bir bo'lak nomi va soni bilan birga ko'rsatiladi

---

## 🛠 Texnologiyalar

| Soha | Texnologiya |
|------|-------------|
| Karkas | Next.js 14 (App Router) + TypeScript |
| Uslublar | Tailwind CSS + shadcn/ui |
| Animatsiya | Framer Motion |
| Ma'lumotlar bazasi | PostgreSQL (Supabase bilan mos) + Prisma ORM |
| Diagrammalar | Recharts |
| Validatsiya | Zod (o'zbekcha xato xabarlari bilan) |
| Eksport | `xlsx` (Excel), `jspdf` + `jspdf-autotable` (PDF) |
| PWA | Service Worker + localStorage navbati |

---

## 🚀 O'rnatish

### 1. Talablar
- **Node.js 18.17** yoki undan yuqori
- **PostgreSQL 14+** (yoki [Supabase](https://supabase.com) bepul hisobi)

### 2. Loyihani yuklab olish

```bash
git clone <repository-url>
cd Maktablar-uchun-so-rovnoma
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash

```bash
cp .env.example .env
```

`.env` faylini oching va to'ldiring:

```env
# Supabase: Project Settings -> Database -> Connection string
DATABASE_URL="postgresql://postgres.xxxx:PAROL@...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxx:PAROL@...pooler.supabase.com:5432/postgres"

ADMIN_USERNAME="hokimiyat"
ADMIN_PASSWORD="admin123"

# Tasodifiy kalit yarating:  openssl rand -base64 32
ADMIN_SESSION_SECRET="bu-kalitni-albatta-ozgartiring-kamida-32-belgi"
```

> ⚠️ **Xavfsizlik:** ishlab chiqarishga (production) chiqarishdan oldin
> `ADMIN_PASSWORD` va `ADMIN_SESSION_SECRET` ni albatta o'zgartiring.

### 4. Ma'lumotlar bazasini tayyorlash

```bash
npm run db:push    # Jadvallarni yaratadi
npm run db:seed    # 70 mahalla, 50 maktab, 35 kasb + 150 ta demo anketa
```

### 4.1. Mahallalar ro'yxati haqida

Tizimga Xatirchi tumanining **70 ta** fuqarolar yig'ini (MFY) kiritilgan.
Manba — tuman hokimligining *«Xatirchi tumanidagi mahalla raislarining
ro'yxati»* rasmiy hujjati; nomlar kirill alifbosidan lotinga o'girilgan.

Yangi MFY tashkil etilsa yoki nomi o'zgarsa, `/admin/settings` →
**Mahallalar** bo'limidan o'zgartiring — yangi yozuv anketada darhol
ko'rinadi, kodga tegish shart emas.

### 5. Ishga tushirish

```bash
npm run dev        # Ishlab chiqish rejimi -> http://localhost:3000
```

Ishlab chiqarish uchun:

```bash
npm run build
npm start
```

**Kirish ma'lumotlari:** `/admin/login` → login `hokimiyat`, parol `admin123`
(yoki `.env` da ko'rsatilganlari).

---

## 📜 Buyruqlar

| Buyruq | Vazifasi |
|--------|----------|
| `npm run dev` | Ishlab chiqish serveri |
| `npm run build` | Ishlab chiqarish uchun yig'ish |
| `npm start` | Yig'ilgan ilovani ishga tushirish |
| `npm run lint` | Kod uslubini tekshirish |
| `npm run typecheck` | TypeScript tiplarini tekshirish |
| `npm run db:push` | Sxemani bazaga qo'llash (migratsiyasiz) |
| `npm run db:migrate` | Migratsiya yaratish va qo'llash |
| `npm run db:seed` | Boshlang'ich ma'lumotlarni yozish |
| `npm run db:studio` | Prisma Studio (bazani ko'rish) |

---

## 🖥 Maktab kompyuterlarida kiosk rejimini sozlash

Ilova PWA sifatida ishlaydi. Chrome/Edge brauzerini kiosk rejimida ishga tushirish:

**Windows** — ish stolida yorliq yarating:
```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=https://SIZNING-MANZILINGIZ/ --disable-pinch --overscroll-history-navigation=0
```

**Linux:**
```bash
chromium-browser --kiosk --app=https://SIZNING-MANZILINGIZ/ --noerrdialogs --disable-infobars
```

Kiosk rejimidan chiqish: `Alt + F4` (Windows) yoki `Ctrl + W`.

> 💡 Anketa yuborilgandan so'ng ekran 7 soniyada o'zi tozalanadi — o'qituvchi
> aralashuvisiz keyingi o'quvchi kelib to'ldiraveradi.

---

## 🌐 Supabase bilan ishlash

1. [supabase.com](https://supabase.com) da yangi loyiha yarating
2. **Project Settings → Database → Connection string** bo'limidan ikkita
   ulanish satrini oling:
   - `DATABASE_URL` — **Transaction pooler** (6543-port), oxiriga
     `?pgbouncer=true&connection_limit=1` qo'shing
   - `DIRECT_URL` — **Session/Direct** (5432-port), migratsiya uchun
3. `npm run db:push && npm run db:seed`

---

## ☁️ Vercel'ga joylashtirish

1. Loyihani GitHub'ga yuklang
2. [vercel.com](https://vercel.com) da **Import Project** ni bosing
3. **Environment Variables** bo'limiga `.env` dagi barcha qiymatlarni kiriting
4. **Deploy** — Vercel `npm run build` ni o'zi bajaradi
   (`prisma generate` build skriptiga kiritilgan)

---

## 🗂 Fayllar tuzilishi

```
Maktablar-uchun-so-rovnoma/
├── prisma/
│   ├── schema.prisma              # Ma'lumotlar bazasi sxemasi
│   └── seed.ts                    # Kataloglar + 150 ta demo anketa
│
├── public/
│   ├── icons/                     # PWA ikonkalari (SVG + PNG 192/512)
│   ├── manifest.json              # PWA manifesti
│   ├── offline.html               # Internet yo'q sahifasi
│   ├── robots.txt
│   └── sw.js                      # Service Worker (oflayn kesh)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Ildiz layout (shrift, toast, SW)
│   │   ├── globals.css            # Tailwind + dizayn tokenlari
│   │   ├── page.tsx               # 🏠 Anketa sahifasi (kiosk)
│   │   │
│   │   ├── admin/
│   │   │   ├── page.tsx           # /admin -> dashboardga yo'naltiradi
│   │   │   ├── login/page.tsx     # Kirish sahifasi
│   │   │   ├── dashboard/page.tsx # 📊 Tahlil paneli
│   │   │   └── settings/page.tsx  # ⚙️ Kataloglar boshqaruvi
│   │   │
│   │   └── api/
│   │       ├── students/route.ts          # POST (ochiq) + GET (admin)
│   │       ├── stats/route.ts             # Dashboard statistikasi
│   │       ├── catalogs/route.ts          # Mahalla/maktab/kasb (ochiq)
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   └── logout/route.ts
│   │       └── admin/
│   │           ├── mahallalar/route.ts    + [id]/route.ts   # CRUD
│   │           ├── maktablar/route.ts     + [id]/route.ts   # CRUD
│   │           └── kasblar/route.ts       + [id]/route.ts   # CRUD
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitivlari
│   │   │   ├── badge.tsx    button.tsx   card.tsx      checkbox.tsx
│   │   │   ├── command.tsx  dialog.tsx   input.tsx     label.tsx
│   │   │   ├── popover.tsx  progress.tsx select.tsx    separator.tsx
│   │   │   ├── skeleton.tsx table.tsx    tabs.tsx      textarea.tsx
│   │   │   └── toast.tsx          # Framer Motion bildirishnomalari
│   │   │
│   │   ├── shared/
│   │   │   ├── searchable-select.tsx      # Qidiruvli ro'yxat
│   │   │   ├── multi-select.tsx           # Ko'p tanlovli filtr
│   │   │   ├── chip-group.tsx             # Katta bosiladigan chiplar
│   │   │   └── service-worker-register.tsx
│   │   │
│   │   ├── survey/                # O'quvchi anketasi
│   │   │   ├── survey-wizard.tsx          # Asosiy holat mashinasi
│   │   │   ├── step-personal.tsx          # 1-qadam
│   │   │   ├── step-interests.tsx         # 2-qadam
│   │   │   ├── step-dream-job.tsx         # 3-qadam
│   │   │   ├── step-future.tsx            # 4-qadam
│   │   │   ├── success-screen.tsx         # Tabrik + avtomatik reset
│   │   │   ├── confetti.tsx               # Konfetti animatsiyasi
│   │   │   ├── field.tsx                  # Maydon + xato ko'rinishi
│   │   │   └── types.ts                   # Forma holati
│   │   │
│   │   └── admin/                 # Hokimiyat paneli
│   │       ├── admin-shell.tsx            # Karkas + navigatsiya
│   │       ├── login-form.tsx
│   │       ├── dashboard-client.tsx       # Filtr/yuklash mantiqi
│   │       ├── kpi-cards.tsx
│   │       ├── filter-bar.tsx
│   │       ├── charts.tsx                 # Barcha 6 ta diagramma
│   │       ├── recommendations-panel.tsx  # Tavsiyalar paneli
│   │       ├── chart-shell.tsx            # Diagramma ramkasi + tooltip
│   │       ├── submissions-table.tsx
│   │       ├── student-modal.tsx
│   │       ├── catalog-manager.tsx        # Mahalla/maktab CRUD
│   │       └── profession-manager.tsx     # Kasblar CRUD
│   │
│   ├── lib/
│   │   ├── constants.ts           # MAHALLALAR, MAKTABLAR, KASBLAR, ranglar
│   │   ├── validation.ts          # Zod sxemalari (o'zbekcha xabarlar)
│   │   ├── prisma.ts              # Prisma mijozi (singleton)
│   │   ├── auth.ts                # HMAC sessiya cookie
│   │   ├── api-auth.ts            # API himoyasi
│   │   ├── filters.ts             # Filtr <-> Prisma `where`
│   │   ├── catalog-crud.ts        # Umumiy CRUD yordamchisi
│   │   ├── dedupe.ts              # Takroriy anketa kaliti (telefon bilan)
│   │   ├── env-check.ts           # Xavfsizlik sozlamalari qulfi
│   │   ├── rate-limit.ts          # Tezlik chegarasi
│   │   ├── recommendations.ts     # Tavsiyalar motori (qoidalar)
│   │   ├── offline.ts             # localStorage navbati
│   │   ├── export-excel.ts        # Excel eksporti
│   │   ├── export-pdf.ts          # PDF hisoboti
│   │   └── utils.ts               # cn(), sana, telefon, qidiruv
│   │
│   ├── types/index.ts             # Umumiy TypeScript tiplari
│   └── middleware.ts              # /admin/* himoyasi
│
├── .env.example
├── components.json                # shadcn/ui sozlamalari
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔌 API qisqacha ma'lumotnomasi

| Metod | Manzil | Himoya | Vazifasi |
|-------|--------|--------|----------|
| `POST` | `/api/students` | Ochiq | Anketani saqlash |
| `GET` | `/api/students` | Admin | Ro'yxat: filtr, qidiruv, sahifalash, `all=1` (eksport) |
| `GET` | `/api/stats` | Admin | Dashboard statistikasi (filtrlar bilan) |
| `GET` | `/api/catalogs` | Ochiq | Mahalla / maktab / kasb ro'yxatlari |
| `POST` | `/api/auth/login` | Ochiq | Tizimga kirish |
| `POST` | `/api/auth/logout` | Ochiq | Chiqish |
| `GET`/`POST` | `/api/admin/mahallalar` | Admin | Mahallalar ro'yxati / qo'shish |
| `PATCH`/`DELETE` | `/api/admin/mahallalar/[id]` | Admin | Tahrirlash / o'chirish |
| `GET`/`POST` | `/api/admin/maktablar` | Admin | Maktablar |
| `PATCH`/`DELETE` | `/api/admin/maktablar/[id]` | Admin | Tahrirlash / o'chirish |
| `GET`/`POST` | `/api/admin/kasblar` | Admin | Kasblar |
| `PATCH`/`DELETE` | `/api/admin/kasblar/[id]` | Admin | Tahrirlash / o'chirish |

**Filtr parametrlari** (`/api/stats` va `/api/students` uchun bir xil):
`mahalla`, `school`, `grade`, `gender`, `category` — vergul bilan ajratilgan;
`dateFrom`, `dateTo` — `YYYY-MM-DD` ko'rinishida.

---

## 🔒 Xavfsizlik

### ⚠️ Ishga tushirishdan oldin majburiy qadam

`.env` (yoki Vercel Environment Variables) da quyidagilarni **albatta**
o'zgartiring:

```bash
# Kuchli parol yaratish (kamida 12 belgi)
openssl rand -base64 24

# Sessiya kaliti (kamida 32 belgi)
openssl rand -base64 32
```

Agar `ADMIN_PASSWORD` `admin123` bo'lib qolsa yoki `ADMIN_SESSION_SECRET`
namunaviy qiymatda qolsa, tizim **production rejimida admin panelga
kirishni butunlay bloklaydi** (`503` xatosi va konsolda ogohlantirish).
Bu ataylab qilingan: himoyasiz panel bilan ishga tushirishdan ko'ra,
umuman kirmaslik xavfsizroq.

### Boshqa himoya choralari

- Admin panel HMAC-SHA256 bilan imzolangan `httpOnly` cookie orqali himoyalangan
  (amal qilish muddati — 8 soat)
- `middleware.ts` barcha `/admin/*` sahifalarini tekshiradi
- Barcha `/api/admin/*` va tahlil so'rovlari serverda qayta tekshiriladi
- Parol doimiy vaqtda taqqoslanadi (timing attack himoyasi)
- Anketa yuborish ochiq, lekin server tomonda Zod bilan qat'iy tekshiriladi
- `/api/students` da tezlik chegarasi: 1 IP dan daqiqasiga 5 ta anketa
- `robots.txt` admin panelni qidiruv tizimlaridan yashiradi

> **Eslatma (rate limit):** chegara xotirada saqlanadi. Vercel kabi
> serverless muhitda har bir funksiya nusxasi o'z xotirasiga ega, shuning
> uchun chegara taxminiy. Amaliy "F5 ni bosaverish" holatini bu to'xtatadi.
> Qat'iy kafolat kerak bo'lsa — Upstash Redis ga o'tish mumkin
> (`src/lib/rate-limit.ts` ni almashtirish kifoya).

---

## 📄 Litsenziya

Ushbu loyiha Xatirchi tumani hokimligi uchun ishlab chiqilgan.

---

**«Kelajak Egasi»** — bugungi orzular, ertangi kasblar. 🎓
