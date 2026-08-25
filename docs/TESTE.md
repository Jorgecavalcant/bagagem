# Como testar — Bagagem (Salto UX 2026-08)

**URL:** https://bagagem.tech42.com.br  
**Local:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login (explícito)

Demo via `POST /api/v1/auth/demo` (usuário/senha dos envs `DEMO_USER` / `DEMO_PASS`).  
**Não há auto-login.** O token só é gravado em `sessionStorage.bagagem_token` após submit do formulário em `/painel` ou no login curto de `/registrar`.  
Botão **Sair** limpa o token. Leitura (listar / por-código / obter / resumo / providers) permanece aberta.

## Contagem do dia

`GET /api/v1/provas/resumo` — timezone **America/Sao_Paulo** (dia civil em SP, mesmo com `created_at` em UTC).

## Seed

Não precisa. Crie a prova pela tela (foto obrigatória).

## Fluxo feliz

1. Abra https://bagagem.tech42.com.br/ → **Registrar prova** (passageiro) ou **Área do operador**.
2. Em `/registrar`: login curto → foto + bilhete/etiqueta → confirma.
3. Em `/painel`: login → ver contadores do dia, thumbs reais, Conferir/Recusar, **Editar** / **Excluir**, **Copiar link** (`/registrar?codigo=`).
4. Deep-link: abra o link copiado — o campo código vem pré-preenchido.
5. Thumb quebrada mostra “imagem indisponível” (sem placeholder falso).
6. Pagamento (se houver): **manual/demo**. Sem API de companhia aérea nesta fase.

## Testes API

```bash
cd api && PYTHONPATH=. pytest -q
```

Cobre auth, PATCH de campos, DELETE (+ remoção de mídia), resumo do dia.

## Nota de build

Se a API falhar no browser após deploy antigo, o front precisa ter sido buildado com `NEXT_PUBLIC_API_URL=https://bagagem.tech42.com.br` (Dockerfile com `ARG`/`ENV`).
