# Como testar — Bagagem (Salto UX 2026-08)

**URL prod:** https://bagagem.tech42.com.br *(pode estar no build antigo — ver nota no fim)*  
**Local (esta missão):** web http://127.0.0.1:3004 · API http://127.0.0.1:8004/docs  
**Local compose:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login (explícito)

Credenciais demo: `demo` / `demo123` (`DEMO_USER` / `DEMO_PASS`).

Rotas de autenticação e gestão:

| Rota | Uso |
|:---|:---|
| `/login` | Login dedicado → redireciona para `/painel` (ou `?next=`) |
| `/painel` | Operador: também aceita login inline |
| `/registrar` | Passageiro: login curto se precisar mutar |
| `/dashboard` | Resumo do dia (exige token) |
| `/settings` | Ajustes locais do ponto (exige token) |

**Não há auto-login.** Token em `sessionStorage.bagagem_token` só após submit.  
Botão **Sair** limpa o token. Leituras abertas: listar / por-código / obter / resumo / providers.

## Contagem do dia

`GET /api/v1/provas/resumo` — timezone **America/Sao_Paulo**. Também visível em `/dashboard`.

## Seed

Não precisa. Crie a prova pela tela (foto obrigatória).

## Fluxo feliz

1. Abra `/` → **Registrar prova** ou **Área do operador** (ou `/login`).
2. Em `/login` (ou login no painel): `demo` / `demo123`.
3. Em `/registrar`: foto + bilhete/etiqueta → confirma.
4. Em `/painel`: contadores, thumbs, Conferir/Recusar, **Editar** / **Excluir**, **Copiar link** (`/registrar?codigo=`).
5. Deep-link: abra o link copiado — o campo código vem pré-preenchido.
6. `/dashboard` e `/settings` para visão gerencial e ajustes.
7. Thumb quebrada mostra “imagem indisponível”.
8. Alternar **Claro/Escuro** (botão fixo).

## Testes API

```bash
cd api && PYTHONPATH=. pytest -q
```

## Ambiente nesta entrega (2026-08-25)

- **GitHub `main`:** rotas Salto UX + `/login` `/settings` `/dashboard` + light/dark.
- **Produção `*.tech42.com.br`:** build antigo até secrets `VPS_HOST`/`VPS_USER`/`VPS_SSH_KEY` no GitHub Actions.
- **Sem Docker Desktop:** API com venv + `cd web && NEXT_PUBLIC_API_URL=http://127.0.0.1:8004 npm run dev -- -p 3004`.
