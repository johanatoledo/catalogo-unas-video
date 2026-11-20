import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jakarta',
});
const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});

export const metadata = {
  charset: "utf-8",
  title: "Michell - Salon And Spa",
  description: "Estética Profesional, Manicure & Nail Art",
  icons: {
    icon: "/branding/logonails.png",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}