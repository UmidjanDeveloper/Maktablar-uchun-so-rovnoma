import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider, themeInitScript } from '@/components/shared/theme-provider';
import { ServiceWorkerRegister } from '@/components/shared/service-worker-register';

/** Asosiy matn shrifti — uzun matnlarda ham oson o'qiladi */
const body = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

/** Sarlavhalar shrifti — geometrik, "texnologik" xarakterdagi */
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

/** Raqamlar uchun — jadval va ko'rsatkichlarda ustunlar tekis turadi */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '600'],
});

export const metadata: Metadata = {
  title: 'Kelajak Egasi — Xatirchi Tuman Kasb Platformasi',
  description:
    "Xatirchi tumani maktab o'quvchilarining kasb tanlovi va qiziqishlarini o'rganish platformasi. Navoiy viloyati.",
  manifest: '/manifest.json',
  applicationName: 'Kelajak Egasi',
  authors: [{ name: 'Xatirchi tumani hokimligi' }],
  keywords: ['Kelajak Egasi', 'Xatirchi', 'Navoiy', 'kasb tanlash', 'maktab', 'anketa'],
  icons: {
    icon: '/logo.svg',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Kelajak Egasi — Xatirchi Tuman Kasb Platformasi',
    description: "O'quvchilarning orzu qilgan kasblarini o'rganamiz va kelajagini birga quramiz.",
    locale: 'uz_UZ',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1120',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Tema sahifa chizilishidan oldin qo'llanadi — busiz bir lahza
          noto'g'ri rangda ko'rinib, keyin "sakrab" o'zgaradi.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ServiceWorkerRegister />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
