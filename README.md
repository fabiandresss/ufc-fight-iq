# UFC Fight IQ

Aplicación web con el historial de peleadores, peleas y eventos de la UFC, un analista con consultas en lenguaje natural y un modelo predictivo de combates con cuotas ficticias. Tema negro / blanco / rojo.

> README provisorio. Proyecto no oficial, sin afiliación con UFC. El logo es un diseño propio, no el logotipo oficial.

## Qué incluye

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio: cifras globales, métodos de victoria, categorías, ranking y último evento |
| `/fighters`, `/fighter?id=` | Búsqueda/filtros de peleadores y perfil con stats e historial |
| `/fights` | Todas las peleas con filtros (peleador, categoría, método, año, título) |
| `/events`, `/event?id=` | Eventos y su cartelera |
| `/predictor` | Elige dos peleadores → probabilidad del modelo, cuotas **ficticias**, comparación y factores |
| `/analyst` | Consultas sobre peleadores, comparaciones y rankings |
| `/models` | Métricas, calibración, pesos y limitaciones del modelo |

## Datos

Los CSV originales van en `dataset/` (no se suben al repositorio: `fighter`, `fight`, `event`, `fighter_bonus`, `master`, `round`).
`scripts/build_data.py` (solo librería estándar de Python) los convierte a `apps/web/public/data/*.json` y entrena el modelo:

```bash
python scripts/build_data.py
```

Hoy: 4.581 peleadores, 11.441 peleas y 1.259 eventos (1993 – 2026).

## Modelo

Regresión logística simétrica con variables calculadas **solo con información previa a cada combate** (edad, alcance, altura, % de victorias previo, experiencia, racha, % de KO y sumisiones, inactividad). Corte temporal 85/15.
Resultado en combates no vistos: accuracy 60,7 %, ROC-AUC 0,65, Brier 0,232 (azar = 50 % / 0,5 / 0,25). Mejora modesta sobre el azar: predecir peleas es difícil y no usa cuotas reales de casas de apuestas.

Las cuotas mostradas son una simulación (probabilidad del modelo + 6 % de margen). No es consejo de apuestas.

## Analista

Motor de consulta local (reglas) sobre el dataset y el modelo. **Aún no hay un LLM conectado** (el sitio es estático); es el siguiente paso, junto con un backend.

## Ejecución local

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm run build    # sitio estático en apps/web/out
```

## Despliegue

`.github/workflows/deploy.yml` publica el sitio en GitHub Pages en cada push a `main`. Requiere **Settings → Pages → Source: GitHub Actions**.

## Pendiente

Backend (FastAPI), base de datos, LLM real para el analista, estadísticas por round y modelos más ricos (Elo, cuotas históricas).
