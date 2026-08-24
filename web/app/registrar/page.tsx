"use client";

import { useState } from "react";
import { apiSend } from "../../lib/api";

export default function Registrar() {
  const [codigo, setCodigo] = useState("");
  const [tipoVinculo, setTipoVinculo] = useState("bilhete");
  const [fotoUrl, setFotoUrl] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [notas, setNotas] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoBase64(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!codigo.trim()) return setErro("Informe o código.");
    if (!fotoBase64 && !fotoUrl.trim())
      return setErro("Envie uma foto ou informe a URL.");

    setEnviando(true);
    try {
      await apiSend("/api/v1/provas", "POST", {
        codigo,
        tipo_vinculo: tipoVinculo,
        notas: notas || undefined,
        foto_url: fotoBase64 ? undefined : fotoUrl,
        foto_base64: fotoBase64 || undefined,
      });
      window.location.href = "/painel";
    } catch (err) {
      setErro(String(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Registrar prova de bagagem</h1>
      <form onSubmit={submit}>
        <p>
          <label>Código</label>
          <br />
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="ABC123" />
        </p>
        <p>
          <label>Vínculo</label>
          <br />
          <select value={tipoVinculo} onChange={(e) => setTipoVinculo(e.target.value)}>
            <option value="bilhete">Bilhete</option>
            <option value="etiqueta">Etiqueta</option>
          </select>
        </p>
        <p>
          <label>Foto (arquivo)</label>
          <br />
          <input type="file" accept="image/*" onChange={onFile} />
        </p>
        <p>
          <label>Ou URL da foto</label>
          <br />
          <input value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="https://..." />
        </p>
        <p>
          <label>Notas</label>
          <br />
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} />
        </p>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Registrar"}
        </button>
      </form>
      <p>
        <a href="/">← Início</a> · <a href="/painel">Painel</a>
      </p>
    </main>
  );
}
