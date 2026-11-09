# Cine App

App móvil (Expo + React Native + TypeScript) que simula una sala de cines: cartelera de películas, detalle de cada una y un mapa de asientos simulado. Consume la API [`noeavl/api-movies`](https://github.com/noeavl/api-movies).

## Requisitos

- Node.js 20+
- La API `api-movies` corriendo (por defecto en `http://localhost:3000`). Ver su README: necesita PostgreSQL y `pnpm run dev`.
- Simulador de iOS/Android, o la app Expo Go en tu teléfono.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y ajusta EXPO_PUBLIC_API_URL
npx expo start
```

### URL de la API según dónde corra la app

| Dónde corre | `EXPO_PUBLIC_API_URL` |
|---|---|
| Simulador iOS / web | `http://localhost:3000/api` |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Teléfono físico | `http://<IP-de-tu-Mac>:3000/api` (misma red Wi‑Fi) |

Si cambias `.env`, reinicia `expo start`.

## Pantallas

1. **Cartelera** (`src/app/index.tsx`): pantalla de cine con la película mejor calificada, buscador y una fila de pósters por categoría. Las categorías sin películas no se muestran.
2. **Detalle** (`src/app/movie/[id]/index.tsx`): póster, año, duración, rating, categoría, director y sinopsis.
3. **Asientos** (`src/app/movie/[id]/seats.tsx`): sala de 8 filas × 10 columnas, 3 horarios, selección múltiple, leyenda y total.

## Qué es simulado

La API no tiene funciones, horarios ni asientos, así que en el cliente:

- Los horarios (16:00, 18:30, 21:00) y el precio por asiento son fijos (`src/lib/seats.ts`).
- Los asientos ocupados (~25 %) se generan con una semilla de `movieId + horario`, por lo que son estables entre aperturas.
- "Confirmar" solo muestra un resumen; no se guarda nada ni se llama a la API.

## Scripts

| Comando | Descripción |
|---|---|
| `npx expo start` | Servidor de desarrollo |
| `npm test` | Pruebas unitarias (Jest) |
| `npx tsc --noEmit` | Comprobación de tipos |

## Estructura

```
src/
├── app/        # Rutas (Expo Router)
├── api/        # Cliente fetch tipado y endpoints
├── hooks/      # TanStack Query: useMovies, useMovie, useCategories
├── components/ # MoviePoster, MovieRow, CinemaScreen, SeatGrid, StateViews
├── lib/        # seats, format, query (política de reintentos)
└── theme.ts
```

Diseño y plan en `docs/superpowers/`.

## Notas sobre la API

- Usa PostgreSQL (no MySQL).
- Las categorías y películas vienen paginadas (máx. 100 por página); la app pide hasta 100 categorías y 20 películas por categoría.
