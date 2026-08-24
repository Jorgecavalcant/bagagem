"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL, Prova, apiGet, apiSend } from "../../lib/api";

export default function Painel() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const qs = filtroCodigo ? `?codigo=${encodeURIComponent(filtroCodigo)}` : "";
      setProvas(await apiGet<Prova[]>(`/api/v1/provas${qs}`));
      setErro(null);
    } catch (e) {
      setErro(String(e));
    }
  }, [filtroCodigo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function mudarStatus(id: number, status: string) {
    try {
      await apiSend(`/api/v1/provas/${id}/status`, "PATCH", { status });
      carregar();
    } catch (e) {
      setErro(String(e));
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Painel de provas</h1>
      <p>
        <input
          placeholder="filtrar por código"
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
        />{" "}
        <button onClick={() => carregar()}>Filtrar</button>{" "}
        <a href="/registrar">+ Registrar</a>
      </p>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th align="left">Código</th>
            <th align="left">Vínculo</th>
            <th align="left">Status</th>
            <th align="left">Foto</th>
            <th align="left">Criado</th>
            <th align="left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {provas.map((p) => (
            <tr key={p.id}>
              <td>{p.codigo}</td>
              <td>{p.tipo_vinculo}</td>
              <td>{p.status}</td>
              <td>
                {p.foto_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${API_URL}${p.foto_url}`} alt={`foto ${p.codigo}`} width={80} />
                )}
              </td>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => mudarStatus(p.id, "conferida")} disabled={p.status === "conferida"}>
                  Conferir
                </button>{" "}
                <button onClick={() => mudarStatus(p.id, "recusada")} disabled={p.status === "recusada"}>
                  Recusar
                </button>
              </td>
            </tr>
          ))}
          {provas.length === 0 && (
            <tr>
              <td colSpan={6}>Nenhuma prova registrada.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>
        <a href="/">← Início</a>
      </p>
    </main>
  );
}
