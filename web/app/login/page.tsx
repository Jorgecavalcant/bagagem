"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../../lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/painel";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(username.trim(), password);
      router.replace(next.startsWith("/") ? next : "/painel");
    } catch {
      setCarregando(false);
      setErro(
        "Não conseguimos entrar. Verifique o usuário e a senha e tente novamente."
      );
    }
  }

  return (
    <main className="site-main site-main--narrow">
      <section className="hero">
        <h1>Entrar</h1>
        <p className="lead">
          Acesse sua conta para acompanhar as bagagens do dia.
        </p>
      </section>

      {erro && (
        <div className="alert" role="alert">
          {erro}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label-caps" htmlFor="username">
            Usuário
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label-caps" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primary" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="panel" style={{ marginTop: "1rem" }}>
        <p style={{ margin: 0 }}>
          Conta de demonstração: <strong>demo</strong> / senha{" "}
          <strong>demo123</strong>
        </p>
      </div>

      <p style={{ marginTop: "1rem" }}>
        Não tem conta? <Link href="/registrar">Cadastre-se</Link> ·{" "}
        <Link href="/">Voltar ao início</Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="site-main site-main--narrow">Carregando…</main>}>
      <LoginForm />
    </Suspense>
  );
}
