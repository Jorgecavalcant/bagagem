export const metadata = { title: "Bagagem", description: "Prova fotográfica — Tech42" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: 24, background: "#10141a", color: "#eef2f7" }}>
        {children}
      </body>
    </html>
  );
}
