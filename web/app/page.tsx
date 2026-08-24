import Link from "next/link";
export default function Home() {
  return (
    <main>
      <p>Tech42</p>
      <h1>Bagagem</h1>
      <p>Foto + bilhete/etiqueta. Sem API de companhia no MVP.</p>
      <p>
        <Link href="/registrar">Registrar prova</Link> · <Link href="/painel">Painel</Link>
      </p>
      <p style={{ opacity: 0.7 }}>Domínio: bagagem.tech42.com.br</p>
    </main>
  );
}
