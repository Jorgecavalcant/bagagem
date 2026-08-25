"use client";

import { useEffect, useState } from "react";
import { readPontoSettings } from "@/lib/settings";

/** Mostra o nome do ponto de atendimento (ajustável em /settings) ao lado da marca. */
export default function PontoNomeBadge() {
  const [pontoNome, setPontoNome] = useState("");

  useEffect(() => {
    setPontoNome(readPontoSettings().pontoNome.trim());
  }, []);

  if (!pontoNome) return null;

  return (
    <span
      className="ponto-nome-badge"
      style={{ color: "var(--muted)", fontSize: "0.85rem" }}
      aria-label={`Ponto de atendimento: ${pontoNome}`}
    >
      {pontoNome}
    </span>
  );
}
