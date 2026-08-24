export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}>
      <h1>Bagagem</h1>
      <p>Prova de bagagem: foto + bilhete/etiqueta + painel.</p>
      <ul>
        <li>
          <a href="/registrar">Registrar prova</a>
        </li>
        <li>
          <a href="/painel">Painel</a>
        </li>
      </ul>
    </main>
  );
}
