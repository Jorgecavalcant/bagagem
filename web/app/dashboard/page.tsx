"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, getToken } from "../../lib/api";

type ResumoDia = {
  dia: string;
  timezone: string;
  registradas: number;
  conferidas: number;
  recusadas: number;
  total: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [resumo, setResumo] = useState<ResumoDia | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      if (!getToken()) {
        router.replace("/login?next=/dashboard");
        return;
      }
      try {
        const data = await apiGet<ResumoDia>("/api/v1/provas/resumo");
        setResumo(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          router.replace("/login?next=/dashboard");
          return;
        }
        setErro(
          err instanceof Error && /401|não autenticado/i.test(err.message)
            ? "Sua sessão expirou. Faça login novamente."
            : "Não foi possível carregar o resumo do dia. Verifique sua conexão e tente novamente."
        );
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [router]);

  if (carregando) {
    return (
      <main className="site-main">
        <p>Carregando resumo do dia…</p>
      </main>
    );
  }

  if (erro || !resumo) {
    return (
      <main className="site-main">
        <div className="alert" role="alert">
          {erro ?? "Não foi possível carregar o resumo do dia."}
        </div>
        <p>
          <Link href="/login?next=/dashboard">Ir para o login</Link>
        </p>
      </main>
    );
  }

  const cards: { titulo: string; valor: number; classe?: string }[] = [
    { titulo: "Registradas", valor: resumo.registradas },
    { titulo: "Conferidas", valor: resumo.conferidas },
    { titulo: "Recusadas", valor: resumo.recusadas, classe: "badge" },
    { titulo: "Total", valor: resumo.total },
  ];

  const pendentes = resumo.registradas;

  return (
    <main className="site-main">
      <section className="hero">
        <h1>Painel do dia</h1>
        <p className="lead">
          Resumo de {resumo.dia} ({resumo.timezone})
        </p>
      </section>

      <div className="receipt" style={{ marginBottom: "1.5rem" }}>
        <p style={{ margin: 0 }}>
          {pendentes > 0
            ? `Há ${pendentes} prova${pendentes > 1 ? "s" : ""} registrada${
                pendentes > 1 ? "s" : ""
              } aguardando conferência.`
            : "Nenhuma prova pendente de conferência agora."}
        </p>
        <Link href="/painel" className="btn btn--primary" style={{ marginTop: "0.75rem" }}>
          Conferir pendentes
        </Link>
      </div>

      <div className="receipt">
        {cards.map((c) => (
          <div key={c.titulo} className="panel">
            <span className="label-caps">{c.titulo}</span>{" "}
            <strong>{c.valor}</strong>
            {c.classe && <span className={c.classe}>{c.titulo}</span>}
          </div>
        ))}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Métrica</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => (
            <tr key={c.titulo}>
              <td>{c.titulo}</td>
              <td>{c.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/painel" className="btn btn--primary">
          Ir para o painel operacional
        </Link>{" "}
        <Link href="/settings" className="btn btn--secondary">
          Configurações
        </Link>
      </p>
    </main>
  );
}
