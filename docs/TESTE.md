# Como testar — Bagagem (2 min)

**URL:** https://bagagem.tech42.com.br  
**Local:** `make up` → http://localhost:3000 · API http://localhost:8000/docs

## Login

**Sem login** — endpoints de prova abertos nesta demo.

## Seed

Não precisa. Crie a prova pela tela.

## Fluxo feliz

1. Abra https://bagagem.tech42.com.br/registrar → foto + bilhete/etiqueta.
2. Confirme o registro.
3. Abra https://bagagem.tech42.com.br/painel → ver provas e status.
4. Pagamento (se houver): **manual/demo**. Sem API de companhia aérea nesta fase.

## Nota

Se a API falhar no browser após deploy antigo, o front precisa ter sido buildado com `NEXT_PUBLIC_API_URL=https://bagagem.tech42.com.br` (Dockerfile com `ARG`/`ENV`).
