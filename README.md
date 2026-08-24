# Bagagem

Prova fotográfica de bagagem/carga vinculada a bilhete ou etiqueta — MVP **sem** API de companhias (fase 2).

**Repositório:** [github.com/Jorgecavalcant/bagagem](https://github.com/Jorgecavalcant/bagagem) (privado)  
**VPS (padrão Tech42):** `/srv/projetos/clientes/bagagem`  
**Domínio:** `bagagem.tech42.com.br` (DNS criado pelo CEO)

Unifica BagagemProva + CargaCheck.

## Stack
Next.js 14 · FastAPI · PostgreSQL 16 · Docker · Caddy

## Como rodar
```bash
cd PROJETOS/bagagem
cp .env.example .env
make up && make test
```

## Docs
[PRD](docs/PRD.md) · [SPEC](docs/SPEC.md) · [DNS-CADDY](docs/DNS-CADDY.md) · [STATE](STATE.md)
