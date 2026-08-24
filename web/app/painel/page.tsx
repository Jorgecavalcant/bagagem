"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export default function PainelPage() {
  const [itens, setItens] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API}/api/v1/provas`).then((r) => r.json()).then(setItens).catch(() => setItens([]));
  }, []);
  return (
    <main>
      <h1>Painel</h1>
      <ul>
        {itens.map((p) => (
          <li key={p.id}>{p.codigo} — {p.foto_url} — {p.created_at}</li>
        ))}
      </ul>
      {itens.length === 0 && <p>Nenhuma prova ainda.</p>}
    </main>
  );
}
