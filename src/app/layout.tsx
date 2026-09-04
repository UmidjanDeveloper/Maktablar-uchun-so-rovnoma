import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { ServiceWorkerRegister } from '@/components/shared/service-worker-register';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
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
    icon: '/icons/icon.svg',
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
  themeColor: '#3366f2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans">
        <ToastProvider>
          {children}
          <ServiceWorkerRegister />
        </ToastProvider>
      </body>
    </html>
  );
}
