# STATE.min — Bagagem

- **Status:** Salto UX 2026-08 (login explícito, CRUD, resumo, deep-link, brand v2)
- **Domínio:** bagagem.tech42.com.br (DNS = CEO)
- **VPS:** /srv/projetos/clientes/bagagem
- **MVP:** foto + bilhete/etiqueta + painel; upload base64/multipart; sem API companhia
- **Auth:** POST /api/v1/auth/demo → Bearer; UI de login no painel/registrar (sem auto-login)
- **API 0.4.0:** PATCH/DELETE provas, GET /provas/resumo (America/Sao_Paulo)
- **Pagamentos:** plugável ManualProvider only (charge exige auth)
- **Atualizado:** 2026-08-24
