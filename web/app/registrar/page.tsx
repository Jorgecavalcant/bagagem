"use client";
import { FormEvent, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export default function RegistrarPage() {
  const [codigo, setCodigo] = useState("");
  const [foto, setFoto] = useState("https://example.com/bagagem.jpg");
  const [msg, setMsg] = useState("");
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const r = await fetch(`${API}/api/v1/provas`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo, foto_url: foto }),
    });
    setMsg(r.ok ? "Prova registrada." : "Falha ao registrar.");
  }
  return (
    <main>
      <h1>Registrar prova</h1>
      <form onSubmit={onSubmit}>
        <label>Bilhete / etiqueta<input value={codigo} onChange={(e)=>setCodigo(e.target.value)} required /></label>
        <label>URL da foto (upload real = fase 2)<input value={foto} onChange={(e)=>setFoto(e.target.value)} required /></label>
        <button type="submit">Salvar</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}
