import Link from "next/link";

export default function Home() {
  return (
    <main className="site-main site-main--narrow">
      <section className="hero">
        <span className="hero__eyebrow">Prova de viagem</span>
        <h1>Registre a bagagem. Guarde a prova.</h1>
        <p className="lead">
          Foto + bilhete ou etiqueta — um registro documental, pronto para
          conferir. Sem complicação: registre e pronto.
        </p>
        <div className="cta-row">
          <Link href="/registrar" className="btn btn--primary">
            Registrar prova
          </Link>
          <Link href="/painel" className="btn btn--secondary">
            Área do operador
          </Link>
        </div>
      </section>

      <aside className="receipt" style={{ marginTop: "3rem" }} aria-label="Como funciona">
        <p className="label-caps">Como funciona</p>
        <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            Informe o código do bilhete ou da etiqueta.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Envie a foto da bagagem ou carga.
          </li>
          <li>No painel, o operador confere ou recusa a prova.</li>
        </ol>
      </aside>
    </main>
  );
}
