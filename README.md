# Pokédex — React

Migración de la Pokédex en JavaScript puro (`../index.html` + `../script.js`)
a **Vite + React 19**, siguiendo el plan de `../MIGRACION-REACT.md`.

## Cómo correrla

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 21 pruebas (Vitest + Testing Library)
npm run lint       # oxlint
npm run build      # versión de producción en dist/
```

## Estructura

```
src/
├── main.jsx                 punto de entrada (StrictMode)
├── App.jsx                  dueño del estado; decide Inicio o FichaPokemon
├── constantes.js            COLORES_TIPO, NOMBRE_STAT, STAT_MAX, ATAJOS
├── estilos/index.css        tokens (:root), reset, body, .rev
├── api/pokeapi.js           todo lo que habla con la API
├── utils/                   lógica pura, sin DOM (validar, similitud, extraer)
├── hooks/                   useBuscarPokemon, useEvoluciones,
│                            useProgresoScroll, useRevelar, useAltura
├── componentes/             un .jsx + un .module.css por componente
└── __tests__/               pruebas de utils, del hook y de la app completa
```

## Qué cambió respecto al plan (y por qué)

| Plan | Implementación | Motivo |
|---|---|---|
| Texto del input local en `Buscador` | Vive en `App` (input controlado) | Hay **dos** `Buscador` (inicio y barra): con estado local se perdía lo escrito al "mudarse". Además sugerencias, atajos y evoluciones escriben en él. |
| `useAltura(ref)` | `const [ref, alto] = useAltura()` con callback ref | La barra aparece y desaparece; un `useRef` normal no avisa cuando el nodo cambia. |
| `--acento` en `document.documentElement` | En un `<div>` contenedor de `App` | Sin efectos secundarios sobre el DOM global; se hereda igual por CSS. |
| — | Componentes extra `Bloque`, `Revelar`, `Chip` | Evitan repetir el mismo marcado en stats/evoluciones y atajos/sugerencias. |
| Timeout con `setTimeout` | `AbortSignal.timeout()` + `AbortSignal.any()` | Distingue "tardó demasiado" (`TimeoutError`) de "llegó otra búsqueda" (`AbortError`). |
| Caché `listaNombres` | Caché de la **promesa** | Dos 404 seguidos no descargan la lista dos veces; si falla, se puede reintentar. |

## Mejoras sobre la versión original

- **Sin carreras:** una búsqueda lenta nunca pisa a una más reciente (abort + id de petición). Probado en `useBuscarPokemon.test.js`.
- **Evoluciones:** se abortan al cambiar de pokémon y validan `response.ok` (antes un error de la API podía romper el `.json()`).
- **Imágenes rotas:** `onError` oculta la imagen en vez de mostrar un ícono roto.
- **Accesibilidad:** las tarjetas de evolución son `<button>` (funcionan con teclado), el error usa `role="alert"`, las barras son `role="meter"`, y se respeta `prefers-reduced-motion`.
- `FichaPokemon` se monta con `key={pokemon.id}`: al cambiar de pokémon las animaciones se reinician solas, sin `classList.remove("visible")`.

## Nota sobre StrictMode

En desarrollo verás cada `fetch` dos veces en la pestaña Network: React monta
los efectos dos veces para comprobar que tienen limpieza. En producción ocurre
una sola vez.
