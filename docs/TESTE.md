# Como testar — Bagagem (2 min)

**URL:** https://bagagem.tech42.com.br  
**Local:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login

Demo via `POST /api/v1/auth/demo` (usuário/senha dos envs `DEMO_USER` / `DEMO_PASS`; defaults locais no Settings).  
O front faz login automático (`ensureAuth`) e envia Bearer nas mutações.  
Leitura (listar / por-código / obter / providers) fica aberta.

## Seed

Não precisa. Crie a prova pela tela.

## Fluxo feliz

1. Abra https://bagagem.tech42.com.br/registrar → foto + bilhete/etiqueta.
2. Confirme o registro.
3. Abra https://bagagem.tech42.com.br/painel → ver provas e status.
4. Pagamento (se houver): **manual/demo**. Sem API de companhia aérea nesta fase.

## Nota

Se a API falhar no browser após deploy antigo, o front precisa ter sido buildado com `NEXT_PUBLIC_API_URL=https://bagagem.tech42.com.br` (Dockerfile com `ARG`/`ENV`).
