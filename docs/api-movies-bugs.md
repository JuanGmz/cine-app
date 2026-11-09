# Bugs en `noeavl/api-movies` que impiden usarla desde la app

Probado contra el commit `a44b71f` ("arquitectura modular completa con pnpm"), con Express 5.3, Zod 4 y Prisma 5.22, sobre PostgreSQL local.

Con estos dos arreglos, la app móvil (cartelera, detalle y asientos) funciona de punta a punta contra la API.

## Bug 1 — Todos los listados devuelven 500

**Afecta a:** `GET /api/movies`, `GET /api/categories`, `GET /api/directors` (incluso sin parámetros).

**Reproducir**

```bash
curl -i localhost:3000/api/categories
# HTTP/1.1 500  {"success":false,"error":{"message":"Error interno del servidor","code":"INTERNAL_ERROR"}}
```

El log de la API muestra `PrismaClientValidationError` con `skip: NaN` y `take: "100"` (un string).

**Causa:** en Express 5, `req.query` es un getter que devuelve un objeto nuevo en cada acceso. `validateQuery` hace `Object.assign(req.query, parsed)`, así que el resultado de Zod (con `page` y `limit` ya convertidos y con sus valores por defecto) se pierde. El controlador lee un `req.query` sin convertir.

**Arreglo** (`src/shared/middlewares/validate.ts`, función `validateQuery`):

```diff
-      Object.assign(req.query, parsed);
+      Object.defineProperty(req, "query", { value: parsed, writable: true, configurable: true });
```

## Bug 2 — `GET /api/movies/:id` siempre devuelve 400

**Afecta a:** `GET`, `PATCH` y `DELETE` de `/:id` en movies, directors y categories.

**Reproducir**

```bash
curl -i localhost:3000/api/movies/<un-uuid-valido>
# HTTP/1.1 400  {"message":"Parámetros de ruta inválidos", ... "Invalid input: expected string, received object"}
```

**Causa:** las rutas usan `validateParams(uuidSchema)`, pero `uuidSchema` es `z.string().uuid()` y `validateParams` lo aplica a `req.params`, que es un objeto `{ id }`. Nunca puede cumplirse.

**Arreglo** (`src/shared/types/common.ts`):

```diff
-export const uuidSchema = z.string().uuid({ message: "ID inválido" });
+export const uuidSchema = z.object({ id: z.string().uuid({ message: "ID inválido" }) });
```

Después del arreglo, un id válido responde 200/404 según exista, y un id que no es UUID responde 400 con `"ID inválido"`.

## Parche completo

```diff
diff --git a/src/shared/middlewares/validate.ts b/src/shared/middlewares/validate.ts
--- a/src/shared/middlewares/validate.ts
+++ b/src/shared/middlewares/validate.ts
@@ -21,7 +21,7 @@ export function validateQuery(schema: ZodSchema) {
   return (req: Request, _res: Response, next: NextFunction) => {
     try {
       const parsed = schema.parse(req.query);
-      Object.assign(req.query, parsed);
+      Object.defineProperty(req, "query", { value: parsed, writable: true, configurable: true });
       next();
     } catch (err) {
       if (err instanceof ZodError) {
diff --git a/src/shared/types/common.ts b/src/shared/types/common.ts
--- a/src/shared/types/common.ts
+++ b/src/shared/types/common.ts
@@ -1,6 +1,6 @@
 import { z } from "zod";
 
-export const uuidSchema = z.string().uuid({ message: "ID inválido" });
+export const uuidSchema = z.object({ id: z.string().uuid({ message: "ID inválido" }) });
```

## Para tener en cuenta (no son bugs)

- `rating` tiene `@default(0)`: una película creada sin rating llega con `0`, no con `null`. La app lo muestra como "Sin calificación".
- `GET /api/categories` incluye `_count.movies`, y la app lo usa para ocultar categorías vacías. Conviene mantenerlo.
- El enunciado pide MySQL, pero esta API usa PostgreSQL.
