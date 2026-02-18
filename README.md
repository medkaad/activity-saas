# Activity Planner (PS/MS/GS) — SaaS

SaaS gratuit pour aider les enseignants de maternelle (PS/MS/GS) à préparer des activités :
- bibliothèque d'activités
- planning hebdomadaire
- génération assistée (LLM + quota/BYOK)
- export PDF

## Stack
- Django + DRF + PostgreSQL
- React (Vite + TS)
- Redis + Celery
- Docker Compose

## Dev (local)
```bash
docker compose up --build

API: http://localhost:8000
Front: http://localhost:5173