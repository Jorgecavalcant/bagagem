export type PontoSettings = {
  pontoNome: string;
  mensagemRodape: string;
  timezone: string;
};

export const SETTINGS_STORAGE_KEY = "bg_settings";

export const SETTINGS_DEFAULTS: PontoSettings = {
  pontoNome: "",
  mensagemRodape: "",
  timezone: "America/Sao_Paulo",
};

/** Lê `bg_settings` do localStorage. Só existe no cliente — ajustes são locais ao navegador. */
export function readPontoSettings(): PontoSettings {
  if (typeof window === "undefined") return SETTINGS_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return SETTINGS_DEFAULTS;
    return { ...SETTINGS_DEFAULTS, ...(JSON.parse(raw) as Partial<PontoSettings>) };
  } catch {
    return SETTINGS_DEFAULTS;
  }
}
