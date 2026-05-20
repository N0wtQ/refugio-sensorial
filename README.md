## ¿Qué es Neuroconecta?

Para acceder a la web -> https://n0wtq.github.io/Neuroconecta

Neuroconecta es una plataforma web gratuita y de código abierto que conecta a personas neurodivergentes (TEA, TDAH, PAS, TOC, dislexia…) con:

- **Espacios silenciosos y accesibles** en España (supermercados con hora silenciosa, aeropuertos con distintivo de discapacidad invisible, bibliotecas con salas de silencio, espacios naturales tranquilos, hoteles autism-friendly…)
- **Herramientas digitales** categorizadas por necesidad (gestión ejecutiva, regulación sensorial, comunicación, salud emocional, accesibilidad cognitiva…)
- **Apoyo inmediato en crisis** con guía paso a paso, respiración guiada, grounding 5-4-3-2-1 y checklist de regulación

## Páginas

| Página | Descripción |
|--------|-------------|
| `index.html` | Landing principal con acceso al mapa, herramientas y apoyo en crisis |
| `mapa-app.html` | Mapa interactivo con +100 lugares verificados en España (Leaflet + OpenStreetMap) |
| `herramientas.html` | Catálogo de +100 apps, webs y recursos digitales con filtros por categoría, perfil ND y precio |
| `saturado.html` | Herramienta de apoyo inmediato para momentos de sobrecarga sensorial o ansiedad |

## Mapa interactivo

- 🛒 Supermercados con hora silenciosa (Carrefour, Altoaragón…)
- ✈️ Aeropuertos con Distintivo de Discapacidad Invisible de AENA
- 🌻 Establecimientos adheridos a Hidden Disabilities Sunflower
- 📚 Bibliotecas con salas de silencio y cabinas insonorizadas
- 🌿 Espacios naturales tranquilos
- 🏨 Hoteles y restaurantes Autism Friendly
- 🎭 Espacios culturales y de ocio inclusivos
- 🏛️ Centros cívicos y servicios de salud certificados

**Función especial:** Pulsa en cualquier punto del mapa sobre tierra para sugerir un nuevo lugar. Se verifica automáticamente si es agua o tierra.

## Herramientas

El catálogo lee `data/herramientas.csv` y permite filtrar por:
- **Categoría** (Gestión Ejecutiva, Regulación Sensorial, Salud Emocional, Comunicación Social…)
- **Perfil neurodivergente** (TEA, TDAH, AACC, DIS, TOC, TCE…)
- **Precio** (Gratis, Freemium, Pago)

## Apoyo en crisis — "Necesito ayuda"

Diseñado para ser usado en momentos de sobrecarga:
- Guía paso a paso (7 pasos, uno por pantalla)
- Respiración guiada con animación visual (4-4-4)
- Grounding 5-4-3-2-1
- Checklist de autorregulación
- Acceso rápido al mapa de espacios silenciosos
- Cero animaciones por defecto.

## Estructura del proyecto

```
docs/
├── index.html          # Landing principal
├── mapa-app.html       # Mapa interactivo (~600 líneas de datos)
├── herramientas.html   # Catálogo de herramientas
├── saturado.html       # Apoyo en crisis
├── data/
│   └── herramientas.csv  # Base de datos de herramientas
├── logo.png            # Logo completo (icono + texto)
├── logo-icon.png       # Icono solo (cerebro)
└── robots.txt
```
