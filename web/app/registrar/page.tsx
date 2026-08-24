"use client";

import { useState } from "react";
import Link from "next/link";
import { apiSend } from "../../lib/api";

function humanError(err: unknown): string {
  const raw = String(err);
  if (raw.includes("Failed to fetch") || raw.includes("NetworkError")) {
    return "Não conseguimos enviar a prova. Verifique a conexão e tente de novo.";
  }
  if (raw.includes("422") || raw.toLowerCase().includes("validation")) {
    return "Alguns dados não puderam ser aceitos. Revise o código e a foto.";
  }
  return "Não foi possível registrar a prova agora. Tente novamente em instantes.";
}

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
    if (!codigo.trim()) {
      setErro("Informe o código do bilhete ou da etiqueta.");
      return;
    }
    if (!fotoBase64 && !fotoUrl.trim()) {
      setErro("Envie uma foto ou informe a URL da imagem.");
      return;
    }

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
      setErro(humanError(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="site-main site-main--narrow">
      <h1>Registrar prova</h1>
      <p className="lead">
        A foto fica vinculada ao código do bilhete ou da etiqueta — um registro
        documental para conferência.
      </p>

      <form className="receipt" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="codigo">
            <span className="label-caps">Código</span>
            <input
              id="codigo"
              name="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="ABC123"
              autoComplete="off"
              required
            />
          </label>
          <p className="field__hint">Código impresso no bilhete ou na etiqueta.</p>
        </div>

        <div className="field">
          <label htmlFor="vinculo">
            <span className="label-caps">Vínculo</span>
            <select
              id="vinculo"
              name="tipo_vinculo"
              value={tipoVinculo}
              onChange={(e) => setTipoVinculo(e.target.value)}
            >
              <option value="bilhete">Bilhete</option>
              <option value="etiqueta">Etiqueta</option>
            </select>
          </label>
        </div>

        <div className="field">
          <label htmlFor="foto">
            <span className="label-caps">Foto (arquivo)</span>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              onChange={onFile}
            />
          </label>
          {fotoBase64 && (
            <div className="preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fotoBase64} alt="Pré-visualização da prova" />
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="fotoUrl">
            <span className="label-caps">Ou URL da foto</span>
            <input
              id="fotoUrl"
              name="foto_url"
              type="url"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://…"
              disabled={!!fotoBase64}
            />
          </label>
          {fotoBase64 && (
            <p className="field__hint">
              Arquivo selecionado — a URL não será usada neste envio.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="notas">
            <span className="label-caps">Notas (opcional)</span>
            <textarea
              id="notas"
              name="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
            />
          </label>
        </div>

        {erro && (
          <div className="alert alert--error" role="alert">
            {erro}
          </div>
        )}

        <div className="cta-row">
          <button type="submit" className="btn btn--primary" disabled={enviando}>
            {enviando ? "Enviando prova…" : "Registrar prova"}
          </button>
          <Link href="/painel" className="btn btn--ghost">
            Ir ao painel
          </Link>
        </div>
      </form>
    </main>
  );
}
