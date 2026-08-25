"use client";

import { useEffect, useState } from "react";
import { readPontoSettings } from "@/lib/settings";

const DEFAULT_TEXT = "Prova de viagem · etiqueta de confiança · Tech42";

/** Rodapé customizável em /settings (mensagemRodape). Ajuste é local ao navegador. */
export default function SiteFooter() {
  const [mensagem, setMensagem] = useState(DEFAULT_TEXT);

  useEffect(() => {
    const custom = readPontoSettings().mensagemRodape.trim();
    if (custom) setMensagem(custom);
  }, []);

  return <footer className="site-footer">{mensagem}</footer>;
}
