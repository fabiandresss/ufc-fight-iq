import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { DataProvider } from "@/lib/data";

export const metadata: Metadata = {
  title: "UFC Fight IQ",
  description: "Historial de peleadores y peleas de UFC, consultas con IA y modelo predictivo de combates",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <DataProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </DataProvider>
        <footer className="mx-auto max-w-6xl border-t border-zinc-800 px-4 py-6 text-xs text-zinc-500">
          Proyecto no oficial, sin afiliación con UFC. Cuotas y apuestas simuladas con fines educativos; las
          probabilidades no garantizan resultados ni son consejo de apuestas.
        </footer>
      </body>
    </html>
  );
}
