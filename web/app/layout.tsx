import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bagagem — Prova de viagem",
  description:
    "Registre a foto da bagagem com o bilhete ou etiqueta — prova simples, pronta para conferir.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="brand" aria-label="Bagagem — início">
              <span className="brand__mark" aria-hidden="true">
                B
              </span>
              <span className="brand__name">Bagagem</span>
            </Link>
            <nav className="nav" aria-label="Principal">
              <Link href="/">Início</Link>
              <Link href="/registrar">Registrar</Link>
              <Link href="/painel">Painel</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          Prova de viagem · etiqueta de confiança · Tech42
        </footer>
      </body>
    </html>
  );
}
