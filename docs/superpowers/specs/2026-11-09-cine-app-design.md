# Cine App — Diseño del frontend móvil

Fecha: 2026-11-09

## Objetivo

App móvil (Expo, React Native + TypeScript) que simula una sala de cines: muestra la cartelera de películas, un detalle de cada una y un mapa de asientos simulado. Consume la API existente `https://github.com/noeavl/api-movies` (Express + Prisma + PostgreSQL). Solo se construye el frontend.

## Contexto de la API (verificado en el repo)

- Base: `/api`. Endpoints usados: `GET /movies`, `GET /movies/:id`, `GET /categories`. (`/directors` existe pero no se usa; el director llega embebido en la película.)
- Respuesta: `{ success, data, meta? }`. `meta = { page, limit, total, totalPages }`.
- `GET /movies` acepta `page`, `limit` (máx. 100), `search`, `categoryId`, `directorId`, `releaseYear`, `minRating`, `sortBy` (`title|releaseYear|rating|createdAt`), `sortOrder`. Incluye `category` y `director`.
- Movie: `id, title, synopsis?, releaseYear, duration? (min), posterUrl?, rating? (0-10), category{id,name,description?}, director{id,name,bio?,birthDate?,nationality?}`. Los ids son UUID.
- La API NO tiene funciones, horarios, salas ni asientos. Todo eso se simula en el cliente.
- Nota: la API usa PostgreSQL, no MySQL como indica el enunciado. No afecta al frontend.

## Alcance

Incluido:
1. **Cartelera** (pantalla principal): pantalla de cine con película destacada, buscador, filas de pósters por categoría.
2. **Detalle de película**: póster, título, año, duración, rating, categoría, director, sinopsis, botón "Elegir asientos".
3. **Mapa de asientos** (simulado): 8 filas × 10 columnas, selección múltiple, leyenda, horarios simulados, resumen con total.

Fuera de alcance (YAGNI): pestaña de directores/categorías, autenticación, compra real, CRUD, persistencia de reservas.

## Stack

Expo (SDK actual) + Expo Router + TypeScript estricto + TanStack Query. Jest (`jest-expo`) para pruebas unitarias.

## Arquitectura

```
cine-app/
├── app/                      # Expo Router
│   ├── _layout.tsx           # QueryClientProvider, tema, Stack
│   ├── index.tsx             # Cartelera
│   └── movie/
│       ├── [id].tsx          # Detalle
│       └── [id]/seats.tsx    # Mapa de asientos
├── src/
│   ├── api/
│   │   ├── client.ts         # fetch + desenvuelve {success,data,meta}; ApiError
│   │   ├── types.ts          # Movie, Category, Director, Paginated<T>
│   │   └── movies.ts         # getMovies, getMovie, getCategories
│   ├── hooks/                # useMovies, useMovie, useCategories (TanStack Query)
│   ├── components/           # MoviePoster, MovieRow, CinemaScreen, SeatGrid, StateViews
│   ├── lib/seats.ts          # ocupación determinista, horarios, total
│   └── theme.ts              # colores, espaciado (tema oscuro, acento dorado)
├── .env.example              # EXPO_PUBLIC_API_URL
└── docs/superpowers/specs/
```

Unidades con una sola responsabilidad: `api/` conoce HTTP; `hooks/` conoce caché; `components/` solo renderiza; `lib/seats.ts` es lógica pura sin dependencias de UI.

## Detalles por pantalla

**Cartelera.** Película destacada = la de mayor rating. Se piden las categorías y, por cada una, `GET /movies?categoryId=…&limit=20` para su fila horizontal. El buscador (con debounce ~300 ms) reemplaza las filas por una lista/grilla de resultados de `GET /movies?search=…`. Pull-to-refresh.

**Detalle.** `GET /movies/:id`. Duración formateada (`2 h 15 min`), rating como `x.x/10`. Campos opcionales ausentes se omiten o muestran "Sin información".

**Asientos.** Parámetros de ruta: `id`. Horarios simulados fijos (p. ej. 16:00, 18:30, 21:00). La ocupación se genera con un PRNG con semilla = `movieId + horario` (≈25 % ocupados), así es estable entre aperturas. Precio simulado fijo por asiento. Estados: libre, ocupado (no seleccionable), elegido. Al cambiar de horario se limpia la selección. El botón "Confirmar" muestra un resumen/confirmación local (sin persistencia ni llamada a la API).

## Configuración

`EXPO_PUBLIC_API_URL` (por defecto `http://localhost:3000/api`). Simulador iOS: `localhost`. Teléfono físico: IP de la Mac en la red local. Android emulador: `10.0.2.2`.

## Manejo de errores

Cada pantalla tiene estados de carga, error (mensaje + "Reintentar") y vacío. `ApiError` conserva mensaje y código de la API. Sin `posterUrl` → placeholder con la inicial del título. Película inexistente (404) → estado de error con volver.

## Pruebas

- Unitarias (Jest): `lib/seats.ts` (determinismo, conteo de ocupados, total, reset de selección), `api/client.ts` (desenvuelto de respuesta, errores `success:false`, errores de red) con `fetch` mockeado.
- Verificación manual en simulador iOS contra la API real si hay PostgreSQL disponible; si no, contra un servidor mock local con datos de ejemplo.

## Criterios de éxito

- La cartelera muestra películas reales de la API agrupadas por categoría y permite buscar.
- Tocar una película abre su detalle con director y categoría.
- Se pueden elegir/deseleccionar asientos libres, no los ocupados, y el total es correcto.
- Estados de carga/error/vacío funcionan (probado apagando la API).
- Las pruebas unitarias pasan.
