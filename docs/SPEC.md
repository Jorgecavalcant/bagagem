# SPEC — Bagagem MVP

## API
- `GET /health`
- `POST /api/v1/provas` — { codigo_bilhete_ou_etiqueta, foto_url, notas? }
- `GET /api/v1/provas` — lista
- `GET /api/v1/provas/{id}`
- `GET /api/v1/provas/por-codigo/{codigo}`

## Web
- `/` landing
- `/registrar` formulário foto+código
- `/painel` lista de provas
