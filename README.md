# UFC Fight IQ

> **README provisorio.** Prototipo de frontend de una plataforma de analytics y predicción de combates de UFC.

## Estado

- ✅ Frontend (Next.js + TypeScript + Tailwind + Recharts) en [`apps/web`](apps/web).
- ⚠️ **Todos los datos son MOCK/ficticios.** Peleadores, eventos, métricas y probabilidades no son reales.
  La "predicción" es una función logística simulada en el navegador; el "AI Analyst" tiene respuestas guionadas.
- ⏳ Pendiente: backend FastAPI, base de datos, pipeline de ML (evaluación temporal, calibración, SHAP) y asistente con LLM.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Dashboard con KPIs y gráficos |
| `/predictor` | Comparador de dos peleadores con probabilidad y factores (mock) |
| `/fighters` y `/fighters/[id]` | Búsqueda y perfil de peleadores |
| `/models` | Comparación de modelos, calibración e importancia de variables |
| `/analyst` | Chat de demostración |
| `/events` | Eventos históricos con predicción vs. resultado |

## Ejecución local

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm run build    # exporta el sitio estático a apps/web/out
```

## Despliegue

El workflow `.github/workflows/deploy.yml` publica el sitio estático en GitHub Pages en cada push a `main`.
Requiere activar en el repositorio **Settings → Pages → Source: GitHub Actions**.

## Aviso

Las probabilidades no garantizan el resultado de un combate y esto no es consejo de apuestas.
