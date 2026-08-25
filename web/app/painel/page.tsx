"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  API_URL,
  Prova,
  ResumoDia,
  apiDelete,
  apiGet,
  apiSend,
  getToken,
  login,
  logout,
} from "../../lib/api";

function humanError(err: unknown): string {
  const raw = String(err);
  if (raw.includes("Faça login") || raw.includes("401")) {
    return "Faça login para continuar.";
  }
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

type EditState = {
  id: number;
  codigo: string;
  tipo_vinculo: string;
  notas: string;
};

function resolveFotoSrc(fotoUrl: string): string {
  return /^https?:\/\//i.test(fotoUrl) ? fotoUrl : `${API_URL}${fotoUrl}`;
}

function Thumb({ fotoUrl, codigo }: { fotoUrl: string | null; codigo: string }) {
  const [falhou, setFalhou] = useState(false);
  if (!fotoUrl || falhou) {
    return <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>imagem indisponível</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="thumb"
      src={resolveFotoSrc(fotoUrl)}
      alt={`Prova fotográfica do código ${codigo}`}
      onError={() => setFalhou(true)}
    />
  );
}

export default function Painel() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [provas, setProvas] = useState<Prova[]>([]);
  const [resumo, setResumo] = useState<ResumoDia | null>(null);
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [copiado, setCopiado] = useState<number | null>(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const qs = filtroCodigo
        ? `?codigo=${encodeURIComponent(filtroCodigo)}`
        : "";
      const [lista, res] = await Promise.all([
        apiGet<Prova[]>(`/api/v1/provas${qs}`),
        apiGet<ResumoDia>("/api/v1/provas/resumo"),
      ]);
      setProvas(lista);
      setResumo(res);
      setErro(null);
    } catch (e) {
      setErro(humanError(e));
    } finally {
      setCarregando(false);
    }
  }, [filtroCodigo]);

  useEffect(() => {
    if (token) carregar();
  }, [carregar, token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    try {
      await login(user.trim(), pass);
      setToken(getToken());
      setPass("");
    } catch {
      setLoginError("Usuário ou senha inválidos.");
    }
  }

  function handleLogout() {
    logout();
    setToken(null);
    setProvas([]);
    setResumo(null);
  }

  async function mudarStatus(id: number, status: string) {
    try {
      await apiSend(`/api/v1/provas/${id}/status`, "PATCH", { status });
      await carregar();
    } catch (e) {
      setErro(humanError(e));
    }
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      await apiSend(`/api/v1/provas/${editing.id}`, "PATCH", {
        codigo: editing.codigo,
        tipo_vinculo: editing.tipo_vinculo,
        notas: editing.notas || null,
      });
      setEditing(null);
      await carregar();
    } catch (err) {
      setErro(humanError(err));
    }
  }

  async function excluir(p: Prova) {
    if (!confirm(`Excluir prova ${p.codigo}? A foto também será removida.`)) return;
    try {
      await apiDelete(`/api/v1/provas/${p.id}`);
      await carregar();
    } catch (err) {
      setErro(humanError(err));
    }
  }

  function copiarComFallback(texto: string): boolean {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }

  async function copiarLink(p: Prova) {
    const url = `${window.location.origin}/registrar?codigo=${encodeURIComponent(p.codigo)}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else if (!copiarComFallback(url)) {
        throw new Error("clipboard indisponível");
      }
      setErro(null);
      setCopiado(p.id);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      setErro(
        `Não conseguimos copiar o link automaticamente. Copie manualmente: ${url}`
      );
    }
  }

  if (!token) {
    return (
      <main className="site-main site-main--narrow">
        <h1>Área do operador</h1>
        <p className="lead">
          Entre com usuário e senha para conferir, editar e excluir provas.
          Não há login automático.
        </p>
        <form className="receipt" onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="user">
              <span className="label-caps">Usuário</span>
              <input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
          </div>
          <div className="field">
            <label htmlFor="pass">
              <span className="label-caps">Senha</span>
              <input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
          </div>
          {loginError && (
            <div className="alert alert--error" role="alert">
              {loginError}
            </div>
          )}
          <div className="cta-row">
            <button type="submit" className="btn btn--primary">
              Entrar
            </button>
            <Link href="/" className="btn btn--ghost">
              Voltar
            </Link>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="site-main">
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Painel de provas</h1>
          <p className="lead" style={{ marginBottom: 0 }}>
            Contagem do dia, conferência e manutenção dos registros.
          </p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {resumo && (
        <div className="receipt" style={{ marginBottom: "1.5rem" }} aria-label="Contagem do dia">
          <p className="label-caps">
            Contagem de {resumo.dia} · {resumo.timezone}
          </p>
          <div className="cta-row" style={{ gap: "1.5rem" }}>
            <span>
              Registradas: <strong>{resumo.registradas}</strong>
            </span>
            <span>
              Conferidas: <strong>{resumo.conferidas}</strong>
            </span>
            <span>
              Recusadas: <strong>{resumo.recusadas}</strong>
            </span>
            <span>
              Total: <strong>{resumo.total}</strong>
            </span>
          </div>
        </div>
      )}

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
                    <Thumb fotoUrl={p.foto_url} codigo={p.codigo} />
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
                      <button
                        type="button"
                        className="btn btn--sm btn--secondary"
                        onClick={() =>
                          setEditing({
                            id: p.id,
                            codigo: p.codigo,
                            tipo_vinculo: p.tipo_vinculo,
                            notas: p.notas ?? "",
                          })
                        }
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--danger"
                        onClick={() => excluir(p)}
                      >
                        Excluir
                      </button>
                      <button
                        type="button"
                        className="btn btn--sm btn--ghost"
                        onClick={() => copiarLink(p)}
                      >
                        {copiado === p.id ? "Copiado!" : "Copiar link"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <form className="receipt" onSubmit={salvarEdicao} style={{ marginTop: "1.5rem" }}>
          <h2>Editar prova #{editing.id}</h2>
          <div className="field">
            <label htmlFor="edit-codigo">
              <span className="label-caps">Código</span>
              <input
                id="edit-codigo"
                value={editing.codigo}
                onChange={(e) => setEditing({ ...editing, codigo: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="field">
            <label htmlFor="edit-vinculo">
              <span className="label-caps">Vínculo</span>
              <select
                id="edit-vinculo"
                value={editing.tipo_vinculo}
                onChange={(e) => setEditing({ ...editing, tipo_vinculo: e.target.value })}
              >
                <option value="bilhete">Bilhete</option>
                <option value="etiqueta">Etiqueta</option>
              </select>
            </label>
          </div>
          <div className="field">
            <label htmlFor="edit-notas">
              <span className="label-caps">Notas</span>
              <textarea
                id="edit-notas"
                value={editing.notas}
                onChange={(e) => setEditing({ ...editing, notas: e.target.value })}
                rows={3}
              />
            </label>
          </div>
          <div className="cta-row">
            <button type="submit" className="btn btn--primary">
              Salvar
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
