# STATE.min — Bagagem

- **Status:** MVP evoluído + auth demo
- **Domínio:** bagagem.tech42.com.br (DNS = CEO)
- **VPS:** /srv/projetos/clientes/bagagem
- **MVP:** foto + bilhete/etiqueta + painel; upload base64/multipart; sem API companhia
- **Auth:** POST /api/v1/auth/demo → Bearer; mutações exigem operador; leitura aberta (creds via env DEMO_USER/DEMO_PASS)
- **Pagamentos:** plugável ManualProvider only (charge exige auth)
- **Atualizado:** 2026-08-24
