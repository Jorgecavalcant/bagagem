# SPEC — Bagagem MVP

## API
- `GET /health` — `{status, produto: bagagem}`
- `POST /api/v1/provas` — codigo + (foto_url | foto_base64) + tipo_vinculo + notas?
- `POST /api/v1/provas/upload` — multipart (codigo, file, tipo_vinculo, notas?)
- `GET /api/v1/provas` — lista; filtros `?codigo=&status=`
- `GET /api/v1/provas/{id}`
- `GET /api/v1/provas/por-codigo/{codigo}` — última prova do código
- `PATCH /api/v1/provas/{id}/status` — registrada|conferida|recusada
- `GET /api/v1/payments/providers` · `POST /api/v1/payments/charge` (ManualProvider)
- Static `/media` e `/api/media` → upload_dir (público preferir `/api/media` — Caddy `/api*`)

## Web
- `/` landing
- `/registrar` foto (arquivo→base64 ou URL) + bilhete/etiqueta
- `/painel` lista, filtro, conferir/recusar

## Fora do MVP
API de companhia aérea/ônibus. Asaas. DNS = CEO.
