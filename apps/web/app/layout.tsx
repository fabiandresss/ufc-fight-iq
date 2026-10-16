import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "UFC Fight IQ",
  description: "Plataforma de analytics y predicción de combates de UFC (prototipo con datos mock)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-slate-500">
          Prototipo frontend con datos ficticios. Una probabilidad no garantiza el resultado de un combate.
        </footer>
      </body>
    </html>
  );
}
