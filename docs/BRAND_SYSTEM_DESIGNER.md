# Brand System — Bagagem

| Campo | Valor |
|:---|:---|
| Produto | Bagagem |
| Versão deste doc | **2.0** vigente |
| Dono | CEO + diretor-design-ux + designer-visual |
| Última atualização | 2026-08-24 |
| Status | [x] vigente para peça pública e produto |

---

## 1. Para que este arquivo existe

Contrato visual e de experiência do **Bagagem** — landing, registro de prova (foto + bilhete/etiqueta), painel e área gerencial.

Implementação: `web/app/globals.css` (tokens `:root`) + App Router. Este doc manda; o CSS obedece.

---

## 2. Escopo

**Vale para:** `bagagem.tech42.com.br` — `/`, `/registrar`, `/painel`, home gerencial, dashboard, settings, users.

**Não vale para:** institucional Tech 42 e demais produtos da casa.

**Público:** quem registra a prova; operador que confere no painel.

---

## 3. Chassis Tech42 (comum) + pele Bagagem (distinta)

### 3.1 Chassis — o que não muda entre produtos da casa

| Camada | Regra |
|:---|:---|
| UX | 1 ação óbvia por vista; DNA Cerbasi; mobile-first; alvos ≥ 44px; contraste WCAG AA |
| Escala tipográfica | Display → H1 → H2 → H3 → Body → Small → Caption |
| Estados UI | hover / focus / disabled / error / success / loading |
| Spacing | base **8px**; múltiplos 4/8/12/16/24/32/48 |
| Canto | **10–12px** em controles (não pill 999px como padrão) |
| Card | só quando há interação (prova acionável) |
| Layouts | home gerencial, dashboard, settings, users (§8) |

### 3.2 Pele — o que é só Bagagem

| Dimensão | Decisão |
|:---|:---|
| Atmosfera | Viagem documental: papel frio de embarque + carimbo de passaporte |
| Paleta | Papel cinza-azulado + tinta navy + carimbo vermelho |
| Display | **Libre Baskerville** (documental, calmo) |
| UI | **Outfit** |
| Voz | Calmo, “guardei evidência”, sem urgência falsa |

**Nota de direção:** produto **claro frio** — **não** cream quente + terracotta (clichê evitado de propósito). Atmosfera de bilhete/etiqueta, não de café lifestyle.

---

## 4. DNA da casa vs voz deste produto

**Base:** DNA Cerbasi — acolher, educar, um próximo passo, sem pressão.

**Voz Bagagem:**

- Tom: calmo, documental, prova guardada
- Trata o leitor de: **você**
- Palavras que usamos: prova, foto, bilhete, etiqueta, conferir
- Palavras que não usamos: urgência falsa, payments no MVP, jargão aéreo desnecessário
- Promessa: **Foto + bilhete registrados; o painel confere.**

---

## 5. UX — como funciona

### 5.1 Princípios

1. Crítico = `/registrar` primeiro
2. Uma ação: **Registrar prova**
3. Painel confere/recusa
4. Erros ao lado do campo
5. Sem payments na jornada

### 5.2 Próximo passo padrão

**Registrar prova** → código + foto → painel confere

### 5.3 Estados obrigatórios (comportamento)

| Estado | O que vê | O que faz |
|:---|:---|:---|
| Carregando | “Enviando…” / “Carregando provas…” | Esperar |
| Vazio | “Nenhuma prova registrada” + link registrar | Registrar |
| Erro | “Informe o código” / causa humana | Corrigir |
| Sucesso | Redireciona ao painel / “Prova registrada” | Conferir |

### 5.4 Acessibilidade (piso)

- Carimbo (`--color-accent`) = CTA e borda curta; **nunca** texto longo em vermelho
- Body em navy no papel frio; muted AA
- Alvos ≥ 44px; `prefers-reduced-motion`

### 5.5 Confiança e dado

- Foto = evidência; retenção mínima alinhada à política; sem PII em logs

---

## 6. UI — pele Bagagem

### 6.1 Logo

| Uso | Arquivo | Fundo |
|:---|:---|:---|
| Marca tipográfica | **Bagagem** em Libre Baskerville | papel frio |
| Favicon | pendente | — |

### 6.2 Cor — regra 70 / 20 / 10

| Fatia | Papel | Hex | Token |
|:---|:---|:---|:---|
| 70% | Fundo | `#EEF0F4` | `--color-bg` |
| 20% | Marca / tinta | `#1F2A3C` / painel `#F8F9FC` | `--color-brand` / `--color-surface` |
| 10% | Acento / CTA | `#B93A3A` | `--color-accent` |

| Nome | Hex | Token | Uso |
|:---|:---|:---|:---|
| Texto | `#1F2A3C` | `--color-text` | body |
| Texto auxiliar | `#5C6678` | `--color-muted` | auxiliar |
| Texto em marca | `#EEF0F4` | `--color-on-brand` | faixa navy |
| Linha | `#D0D5DE` | `--color-border` | bordas |
| Sucesso | `#2A7A4B` | `--color-success` | conferida |
| Erro | `#B42318` | `--color-error` | recusa / validação |
| Hover accent | `#C94A4A` | `--color-accent-hover` | CTA hover |
| Disabled | `#9AA3B0` | `--color-disabled` | inativo |

### 6.3 Tipografia

| Papel | Família | Pesos | Token | Fallback |
|:---|:---|:---|:---|:---|
| Display / títulos | Libre Baskerville | 400–700 | `--font-display` | Georgia, serif |
| UI / corpo | Outfit | 400–600 | `--font-ui` | system-ui, sans-serif |

**Escala (chassis):** Display 40 → H1 32 → H2 24 → H3 20 → Body 16 → Small 14 → Caption 12.

### 6.4 Espaço, canto, elevação

| Token | Valor | Uso |
|:---|:---|:---|
| `--space-unit` | 8px | base |
| `--radius-control` | 10px | botão, input (ângulo de etiqueta) |
| `--radius-surface` | 12px | painéis |
| `--shadow-soft` | `0 4px 14px rgba(31,42,60,.08)` | elevação papel; sem glow |
| `--max-width` | 960px | conteúdo |

### 6.5 Estados visuais de controle

| Estado | Botão primário | Input |
|:---|:---|:---|
| Default | bg accent, texto branco | bg surface, border |
| Hover | accent-hover | border brand suave |
| Focus | ring 2px brand (navy) | ring 2px brand |
| Disabled | disabled + opacity 0.55 | idem |
| Error | — | border error + texto ao lado |
| Success | — | feedback success |
| Loading | “Enviando…” + disabled | — |

**Nota:** ring de foco em navy (brand), não no carimbo — evita “alerta” permanente no focus.

### 6.6 Peças de interface

| Peça | Regra |
|:---|:---|
| Botão principal | **Registrar prova**; um por vista; carimbo |
| Botão secundário | Contorno navy; Conferir / Voltar |
| Upload foto | área clara, borda tracejada border; preview com canto 12px |
| Tabela (painel) | código, status, data, ações conferir/recusar |
| Card | só prova clicável no painel |

### 6.7 Movimento

Envio/confirm ≤ 200ms; sem glow. `prefers-reduced-motion` off.

---

## 7. Layouts gerenciais (padrões)

### 7.1 Home gerencial

- Shell: marca + conta
- Centro: CTA único **Registrar prova** + atalho Painel
- KPI: provas do dia / pendentes de conferência

### 7.2 Dashboard

- Fila de conferência → recentes → recusadas
- Número grande = pendentes; ação = abrir primeira pendente

### 7.3 Settings

- Seções: Organização, Retenção de fotos, Campos obrigatórios, Notificações
- Salvar = único primário

### 7.4 Users

- Tabela: nome, papel (registrador/conferente/admin), status
- CTA: **Convidar**
- Vazio: tipografia Baskerville + CTA

---

## 8. Tokens CSS concretos (`web/app/globals.css`)

```css
:root {
  /* Pele Bagagem */
  --color-bg: #EEF0F4;
  --color-surface: #F8F9FC;
  --color-brand: #1F2A3C;
  --color-accent: #B93A3A;
  --color-accent-hover: #C94A4A;
  --color-text: #1F2A3C;
  --color-muted: #5C6678;
  --color-on-brand: #EEF0F4;
  --color-border: #D0D5DE;
  --color-success: #2A7A4B;
  --color-error: #B42318;
  --color-disabled: #9AA3B0;
  --color-ring: #1F2A3C;
  --color-on-accent: #FFFFFF;

  --font-display: "Libre Baskerville", Georgia, serif;
  --font-ui: "Outfit", system-ui, sans-serif;

  /* Chassis */
  --space-unit: 8px;
  --radius-control: 10px;
  --radius-surface: 12px;
  --shadow-soft: 0 4px 14px rgba(31, 42, 60, 0.08);
  --max-width: 960px;
  --touch-min: 44px;
}
```

---

## 9. Aplicações fora da tela

| Peça | Como vestir |
|:---|:---|
| Post | Papel frio + tipografia Baskerville + um detalhe carimbo |
| WhatsApp | Voz §4; link Registrar |

---

## 10. Pode / não pode

**Pode:** papel frio, Baskerville, CTA carimbo, atmosfera bilhete/etiqueta.

**Não pode:** cream quente + terracotta clichê, dark-mode forçado, roxo/indigo, Inter/Roboto, glow, cluster de pills, payments no MVP.

---

## 11. Inventário

| Arquivo | Onde |
|:---|:---|
| Este documento | `docs/BRAND_SYSTEM_DESIGNER.md` |
| Tokens CSS | `web/app/globals.css` |
| Layout + fontes | `web/app/layout.tsx` |

---

## 12. Governança

Vigente 2026-08-24 (v2.0). Mudança de cor/tipo: este doc + `:root` juntos.

---

## 13. Checklist

- [x] Doc v2.0 vigente
- [x] Chassis + pele (viagem documental)
- [x] Cream+terracotta clichê removido
- [x] Layouts home/dashboard/settings/users
- [x] Tokens CSS nomeados
- [x] Uma ação óbvia; distinto dos outros 3

---

*Tech 42 LTDA — Bagagem · Brand System 2.0 · 2026-08-24*
