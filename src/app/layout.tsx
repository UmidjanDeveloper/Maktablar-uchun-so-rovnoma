import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { ServiceWorkerRegister } from '@/components/shared/service-worker-register';

/** Asosiy matn shrifti — uzun matnlarda ham oson o'qiladi */
const body = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

/** Sarlavhalar shrifti — geometrik, iliq va ishonchli */
const display = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
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
  themeColor: '#17559B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink">
        <ToastProvider>
          {children}
          <ServiceWorkerRegister />
        </ToastProvider>
      </body>
    </html>
  );
}
