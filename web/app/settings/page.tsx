"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, logout } from "../../lib/api";
import {
  PontoSettings,
  SETTINGS_DEFAULTS,
  SETTINGS_STORAGE_KEY,
  readPontoSettings,
} from "../../lib/settings";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PontoSettings>(SETTINGS_DEFAULTS);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login?next=/settings");
      return;
    }
    setSettings(readPontoSettings());
  }, [router]);

  function onChange<K extends keyof PontoSettings>(key: K, value: PontoSettings[K]) {
    setSalvo(false);
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    setSalvo(true);
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!getToken()) return null;

  return (
    <main className="site-main site-main--narrow">
      <section className="hero">
        <h1>Configurações</h1>
        <p className="lead">Ajuste como o sistema se comporta no seu ponto de atendimento.</p>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Estes ajustes ficam salvos só neste navegador e aparecem no cabeçalho e no rodapé das telas.
        </p>
      </section>

      {salvo && (
        <div className="alert" role="status">
          Configurações salvas com sucesso.
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label-caps" htmlFor="pontoNome">
            Nome do ponto
          </label>
          <input
            id="pontoNome"
            value={settings.pontoNome}
            placeholder="Ex.: Terminal Central — Guichê 3"
            onChange={(e) => onChange("pontoNome", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label-caps" htmlFor="mensagemRodape">
            Mensagem do rodapé
          </label>
          <textarea
            id="mensagemRodape"
            rows={3}
            value={settings.mensagemRodape}
            placeholder="Texto exibido no rodapé das telas"
            onChange={(e) => onChange("mensagemRodape", e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label-caps" htmlFor="timezone">
            Fuso horário
          </label>
          <select
            id="timezone"
            value={settings.timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
          >
            <option value="America/Sao_Paulo">Brasília (America/Sao_Paulo)</option>
            <option value="America/Manaus">Manaus (America/Manaus)</option>
            <option value="America/Rio_Branco">Rio Branco (America/Rio_Branco)</option>
            <option value="America/Noronha">Noronha (America/Noronha)</option>
          </select>
        </div>

        <button type="submit" className="btn btn--primary">
          Salvar configurações
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <button type="button" className="btn btn--secondary" onClick={handleLogout}>
        Sair da conta
      </button>

      <p style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Voltar ao painel</Link>
      </p>
    </main>
  );
}
