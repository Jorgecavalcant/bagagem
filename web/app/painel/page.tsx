"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { API_URL, Prova, apiGet, apiSend } from "../../lib/api";

function humanError(err: unknown): string {
  const raw = String(err);
  if (raw.includes("Failed to fetch") || raw.includes("NetworkError")) {
    return "Não conseguimos carregar as provas. Verifique a conexão e tente de novo.";
  }
  return "Não foi possível atualizar agora. Tente novamente.";
}

function badgeClass(status: string): string {
  if (status === "conferida") return "badge badge--conferida";
  if (status === "recusada") return "badge badge--recusada";
  return "badge badge--registrada";
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Painel() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const qs = filtroCodigo
        ? `?codigo=${encodeURIComponent(filtroCodigo)}`
        : "";
      setProvas(await apiGet<Prova[]>(`/api/v1/provas${qs}`));
      setErro(null);
    } catch (e) {
      setErro(humanError(e));
    } finally {
      setCarregando(false);
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
      setErro(humanError(e));
    }
  }

  return (
    <main className="site-main">
      <h1>Painel de provas</h1>
      <p className="lead">
        Filtre por código, confira ou recuse. Uma ação clara por prova.
      </p>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="filtro">
            <span className="label-caps">Filtrar por código</span>
            <input
              id="filtro"
              value={filtroCodigo}
              onChange={(e) => setFiltroCodigo(e.target.value)}
              placeholder="ABC123"
              autoComplete="off"
            />
          </label>
        </div>
        <button type="button" className="btn btn--secondary" onClick={() => carregar()}>
          Filtrar
        </button>
        <Link href="/registrar" className="btn btn--primary">
          Registrar prova
        </Link>
      </div>

      {erro && (
        <div className="alert alert--error" role="alert">
          {erro}
        </div>
      )}

      {carregando && (
        <div className="alert alert--info" role="status">
          Carregando suas provas…
        </div>
      )}

      {!carregando && provas.length === 0 && (
        <div className="receipt empty">
          <h2>Ainda não há provas</h2>
          <p>Registre a primeira foto vinculada ao bilhete ou à etiqueta.</p>
          <Link href="/registrar" className="btn btn--primary">
            Registrar prova
          </Link>
        </div>
      )}

      {!carregando && provas.length > 0 && (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Vínculo</th>
                <th scope="col">Status</th>
                <th scope="col">Foto</th>
                <th scope="col">Criado</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {provas.map((p) => (
                <tr key={p.id}>
                  <td className="code">{p.codigo}</td>
                  <td style={{ textTransform: "capitalize" }}>{p.tipo_vinculo}</td>
                  <td>
                    <span className={badgeClass(p.status)}>{p.status}</span>
                  </td>
                  <td>
                    {p.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="thumb"
                        src={`${API_URL}${p.foto_url}`}
                        alt={`Prova fotográfica do código ${p.codigo}`}
                      />
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                  <td>{formatWhen(p.created_at)}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn--sm btn--secondary"
                        onClick={() => mudarStatus(p.id, "conferida")}
                        disabled={p.status === "conferida"}
                      >
                        Conferir
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--danger"
                        onClick={() => mudarStatus(p.id, "recusada")}
                        disabled={p.status === "recusada"}
                      >
                        Recusar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
