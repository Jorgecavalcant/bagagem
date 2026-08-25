# PRD — Bagagem

> **Produto:** Bagagem  
> **Domínio:** https://bagagem.tech42.com.br  
> **Path:** `PROJETOS/bagagem`  
> **Prioridade conselho:** 3  
> **Versão:** Salto UX 2026-08  
> **Status:** [x] Em revisão (CPO) — aguarda aprovação CEO  
> **Telas:** `/` (landing), `/registrar`, `/painel`

---

## Em uma frase

Registro documental de bagagem: **foto real** + vínculo a **bilhete/etiqueta**, com painel operacional do dia.

---

## Problema (por que o salto agora)

O MVP já registra prova e lista no painel, mas a experiência ainda falha no uso real:

1. Login do operador é invisível (auto-login) — não há sessão operacional explícita
2. CRUD incompleto — cria e muda status; falta editar/excluir registro
3. Painel sem contagem do dia — operador não fecha o turno com números
4. Papéis passageiro vs operador misturados na mesma navegação

**Se não resolver:** o produto não passa no “usable demo” do conselho (prio 3).

---

## Objetivos e métricas

| Objetivo | Métrica de sucesso |
|---|---|
| Prova com imagem real no painel | Thumbnail carrega a foto salva (não placeholder) |
| Operador autentica de forma explícita | Login visível; mutações só com sessão |
| Contagem do dia no painel | Totais: registradas / conferidas / recusadas do dia |
| CRUD mínimo de registro | Criar, listar, editar campos, excluir, mudar status |
| Papéis claros (SHOULD) | Landing/CTA separam “Registrar” (passageiro) de “Painel” (operador) |

---

## Escopo Salto UX 2026-08

### MUST (conselho)

- [ ] Thumbs / imagens **reais** no painel (URL de mídia funcional)
- [ ] CRUD de bilhete/etiqueta/registro (criar, ler, editar, excluir + status)
- [ ] Login operacional **explícito** (não só auto-login invisível)
- [ ] Painel com **contagem do dia**
- [ ] QR de vínculo **somente se fizer sentido** (ex.: deep-link `/registrar?codigo=…`) — não inventar fluxo QR complexo

### SHOULD

- [ ] Fluxo passageiro vs operador claramente separado na UI (CTA, copy, rota protegida do painel)

### WON'T (não inflar)

- API de companhia aérea/ônibus
- OCR de bilhete/etiqueta
- MCP / agentes no produto
- Asaas / gateway de pagamento no core deste salto
- App nativo

---

## User Stories

**Papéis:** Passageiro/cliente · Operador

1. Como passageiro, quero registrar foto + código (bilhete ou etiqueta), para guardar prova sem falar com ninguém.
2. Como operador, quero entrar com usuário/senha, para o painel não ficar aberto a qualquer um.
3. Como operador, quero ver thumbs reais e totais do dia, para conferir o turno em um olhar.
4. Como operador, quero editar ou excluir um registro errado, para corrigir sem gambiarra.
5. Como passageiro (SHOULD), quero um caminho óbvio só de registro, sem ver ações de conferência.

---

## Regras de negócio

1. Toda prova exige código + foto (arquivo ou URL válida que resulte em mídia servível).
2. `tipo_vinculo` ∈ {`bilhete`, `etiqueta`}.
3. Status ∈ {`registrada`, `conferida`, `recusada`}.
4. Mutações (criar/editar/excluir/status) exigem operador autenticado.
5. Contagem do dia = registros com data local do dia corrente (timezone do servidor documentada na SPEC).
6. QR (se feito): só gera/abre link com código pré-preenchido — sem inventário de QR dinâmico.

**Compliance**

- [x] LGPD: foto e código são dados operacionais; sem CPF/telefone no MVP; exclusão de registro = direito mínimo de limpeza operacional
- [x] CVM 175: N/A (não é produto financeiro)
- [x] Segredos só em `.env` (DEMO_USER / DEMO_PASS / secrets)

---

## Contexto técnico (basico — detalhe na SPEC)

- Stack existente: FastAPI + Next.js 14 · domínio Caddy
- Já existe: `POST/GET provas`, `PATCH status`, auth demo Bearer, upload base64/multipart
- Gap deste salto: UI de login, DELETE/PATCH de registro, contadores do dia, garantia de thumbs, opcional QR link

---

## Prioridade

- **Urgência:** Alta (conselho prio 3)
- **Depende de:** MVP já no ar (`bagagem.tech42.com.br`)
- **Bloqueia:** demo “salto UX” do produto Bagagem

---

## Histórico

| Versão | Data | O que mudou |
|---|---|---|
| MVP | 2026-08 | Scaffold: foto + vínculo + painel |
| Salto UX 2026-08 | 2026-08-24 | MUST conselho: thumbs reais, CRUD, login explícito, contagem do dia, QR se fizer sentido |
