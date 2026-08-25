# STATE.min — Bagagem

- **Status:** Salto UX 2026-08 (login explícito, CRUD, resumo, deep-link, brand v2)
- **Domínio:** bagagem.tech42.com.br (DNS = CEO)
- **VPS:** /srv/projetos/clientes/bagagem
- **Deploy:** `.github/workflows/deploy.yml` — push/merge main → CI gate → SSH VPS (`git reset --hard origin/main` + `docker compose up -d --build`, preserva .env) → healthcheck `/health`. Secrets `VPS_*` ainda ausentes (CD bloqueado no SSH).
- **MVP:** foto + bilhete/etiqueta + painel; upload base64/multipart; sem API companhia
- **Auth:** POST /api/v1/auth/demo → Bearer; UI de login no painel/registrar (sem auto-login)
- **API 0.4.0:** PATCH/DELETE provas, GET /provas/resumo (America/Sao_Paulo)
- **Pagamentos:** plugável ManualProvider only (charge exige auth)
- **Atualizado:** 2026-08-25
- **Log 2026-08-25:** Deploy YAML corrigido (PR fix 2026-08-25): Telegram sem secrets.* em if:; healthcheck só `/health`. Pipeline parseia OK; job deploy falha em `Preparar chave SSH` porque secrets `VPS_SSH_KEY`/`VPS_HOST`/`VPS_USER` estão vazios/ausentes — VPS NÃO tocada. Produção estável (smoke /health=200). CEO: cadastrar secrets VPS_* (e opcional TELEGRAM_*) nos 4 repos.

- **Log 2026-08-25:** branch claude/ceo-ready-20260825 — light/dark + gaps CEO-ready; builds/tests verdes; prod ainda depende de secrets VPS_*.
