# Brand System — Bagagem

| Campo | Valor |
|:---|:---|
| Produto | Bagagem |
| Versão deste doc | 1.0 vigente |
| Dono | CEO + designer-visual |
| Última atualização | 2026-08-24 |
| Status | [x] vigente para peça pública |

---

## 1. Para que este arquivo existe

Contrato visual e de experiência do **Bagagem** — landing, registro de prova (foto + bilhete/etiqueta) e painel.

Implementação: `web/app/globals.css` + App Router.

---

## 2. Escopo

**Vale para:** `bagagem.tech42.com.br`, `/`, `/registrar`, `/painel`.

**Não vale para:** institucional Tech 42 e demais produtos da casa.

**Público:** quem registra a prova; operador que confere no painel.

---

## 3. DNA da casa vs voz deste produto

**Base:** DNA Cerbasi — acolher, educar, um próximo passo, sem pressão.

**Voz deste produto:**

- Tom: calmo, documental, “guardei evidência”
- Trata o leitor de: **você**
- Palavras que usamos: prova, foto, bilhete, etiqueta, conferir
- Palavras que não usamos: urgência falsa, payments no MVP, jargão aéreo
- Promessa: **Foto + bilhete registrados; o painel confere.**

---

## 4. UX

### 4.1 Princípios

1. Crítico = `/registrar` primeiro
2. Uma ação: Registrar prova
3. Painel confere/recusa
4. Erros ao lado do campo
5. Sem payments na jornada

### 4.2 Próximo passo

**Registrar prova** → código + foto → painel

### 4.3 Estados

| Estado | O que vê | O que faz |
|:---|:---|:---|
| Carregando | “Enviando…” / “Carregando provas…” | Esperar |
| Vazio | “Nenhuma prova registrada” + link registrar | Registrar |
| Erro | “Informe o código” / causa humana | Corrigir |
| Sucesso | Redireciona ao painel | Conferir |

### 4.4 Acessibilidade

- Produto **claro** (único dos 4)
- Body navy `#1A2744`; copper `#C47B3A` = CTA/borda só (não texto longo)
- Muted `#5C6578`; alvos ≥ 44px; `prefers-reduced-motion`

---

## 5. UI

### 5.2 Cor — 70 / 20 / 10

| Fatia | Hex | Papel |
|:---|:---|:---|
| 70% | `#F3EEE6` | Fundo areia / papel |
| 20% | `#1A2744` | Marca / títulos |
| 10% | `#C47B3A` | CTA etiqueta |

| Extra | Hex |
|:---|:---|
| Panel | `#FFFBF6` |
| Texto | `#1A2744` |
| Muted | `#5C6578` |
| Linha | `#D9D0C4` |
| Ok | `#2F7D4B` |
| Erro | `#B42318` |

### 5.3 Tipografia

| Papel | Família |
|:---|:---|
| Título | Libre Baskerville |
| UI | Outfit |

Atmosfera: papel/recibo/etiqueta — textura sutil, limpo.

---

## 7. Pode / não pode

**Pode:** light paper, Baskerville, CTA copper, registrar como primário.

**Não pode:** dark-mode forçado, roxo/indigo, Inter/Roboto, terracotta clichê no fundo inteiro.

---

## 8. Inventário

| Arquivo | Onde |
|:---|:---|
| Este doc | `docs/BRAND_SYSTEM_DESIGNER.md` |
| Tokens | `web/app/globals.css` |

---

*Tech 42 LTDA — Bagagem.*
