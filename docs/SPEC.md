# SPEC — Bagagem · Salto UX 2026-08

> Complementa o MVP. Só o delta necessário para o MUST do conselho. Sem código nesta entrega.

**Produto:** Bagagem · https://bagagem.tech42.com.br  
**Telas:** `/`, `/registrar`, `/painel` (+ eventual `/login` ou modal de login no painel)

---

## Baseline (já existe — não reescrever)

### API
- `GET /health` — `{status, produto: bagagem}`
- `POST /api/v1/auth/demo` — username/password → Bearer
- `POST /api/v1/provas` · `POST /api/v1/provas/upload`
- `GET /api/v1/provas` · `GET /api/v1/provas/{id}` · `GET /api/v1/provas/por-codigo/{codigo}`
- `PATCH /api/v1/provas/{id}/status` — registrada|conferida|recusada
- `PATCH /api/v1/provas/{id}` — codigo, tipo_vinculo, notas
- `DELETE /api/v1/provas/{id}` — remove registro + mídia
- `GET /api/v1/provas/resumo` — contagem do dia (America/Sao_Paulo)
- Static `/media` e `/api/media` → upload_dir
- Payments ManualProvider (fora do foco deste salto)

### Web
- `/` landing · `/registrar` (+ `?codigo=`) · `/painel` (login explícito + CRUD + resumo)
- Front: token só após login visível (`sessionStorage.bagagem_token`) — sem auto-login

---

## Delta Salto UX 2026-08

### 1. Imagens reais (MUST)

| Regra | Detalhe |
|---|---|
| Thumb no painel | `img.src` aponta para mídia servível (`API_URL` + `foto_url` ou `/api/media/...`) |
| Preview no registro | Após escolher arquivo, preview local; após salvar, painel mostra a mesma prova |
| Falha | Se mídia 404, UI mostra “imagem indisponível” — não inventar placeholder decorativo como se fosse foto |

### 2. CRUD registro (MUST)

| Ação | Comportamento |
|---|---|
| Create | Já existe (POST / provas + upload) |
| Read | Já existe (lista + por id/código) |
| Update | `PATCH /api/v1/provas/{id}` — campos: `codigo`, `tipo_vinculo`, `notas` (status continua no endpoint de status) |
| Delete | `DELETE /api/v1/provas/{id}` — remove registro + arquivo de mídia se houver |
| Auth | Create/Update/Delete/Status → Bearer operador |

UI no `/painel`: ações Editar / Excluir por linha (além de Conferir/Recusar).

### 3. Login operacional explícito (MUST)

| Item | Spec |
|---|---|
| UI | Tela ou gate em `/painel` (e mutações): usuário + senha → `POST /api/v1/auth/demo` |
| Sessão | Guardar token só após submit explícito; botão Sair limpa token |
| Proibido neste salto | Auto-login silencioso (`ensureAuth` sem UI) no fluxo do operador |
| Passageiro | `/registrar` pode permanecer aberto (leitura/criação pública **só se** regra de negócio atual exigir auth em POST — nesse caso, criar registro usa sessão de passageiro “convidado” **ou** o registro continua autenticado mas com CTA “Entrar para registrar” — **decisão mínima:** mutações de operador no painel exigem login explícito; se API já exige Bearer em POST prova, o `/registrar` mostra login curto antes do envio, sem credenciais hardcode na UI |

### 4. Contagem do dia (MUST)

| Item | Spec |
|---|---|
| UI | No topo do `/painel`: cards ou linha com totais do dia |
| Contadores | `registradas` · `conferidas` · `recusadas` · `total` (somente `created_at` = hoje) |
| API | Preferência: `GET /api/v1/provas/resumo?dia=hoje` **ou** calcular no front a partir de `GET /api/v1/provas` filtrado — escolher a opção de **menor esforço** que feche o MUST |
| Timezone | Documentar: data do servidor (UTC ou America/Sao_Paulo) — uma linha no TESTE.md |

### 5. QR vínculo (MUST se fizer sentido)

| Decisão | Critério |
|---|---|
| Fazer | Se deep-link `/registrar?codigo=XYZ` pré-preenche o campo — 1 endpoint ou query string, sem lib de QR server |
| Não fazer | Gerador de QR em massa, etiquetas PDF, scanner nativo |
| UI mínima | Botão “Copiar link do registro” no painel (opcional) **ou** omitir QR se o time julgar sem valor no demo |

### 6. Passageiro vs operador (SHOULD)

- Landing: CTA primário “Registrar prova” · secundário “Área do operador”
- `/painel` redireciona para login se sem token
- Copy distinta (sem misturar “conferir” no fluxo do passageiro)

---

## Fora deste salto (WON'T)

- API companhia · OCR · MCP · Asaas · multi-tenant real · app nativo

---

## Checklist DoD — MUST

- [x] Thumb no painel mostra foto real de prova recém-registrada
- [x] Operador faz login visível; sem token → sem mutações no painel
- [x] Operador consegue editar e excluir um registro
- [x] Painel exibe contagem do dia (4 números acima)
- [x] QR/deep-link: `/registrar?codigo=` + botão Copiar link no painel
- [x] Nada de OCR / API companhia / MCP neste PR

---

## DNS / Deploy

Ver `docs/DNS-CADDY.md` e `docs/DEPLOY-VPS.md`. DNS = CEO. Sem secrets no repo.
