# Plan estratégico de SEO — Refugio Sensorial

> **Sitio:** https://www.refugio-sensorial.com · SPA estática (React + Vite) en GitHub Pages
> **Realidad del proyecto:** directorio de recursos digital para personas neurodivergentes en España (sin sede física, sin reservas, sin CMS). Proyecto personal de Almudena Bedoya.
> Este plan adapta las recomendaciones genéricas de SEO a lo que el sitio ES: las secciones sobre LocalBusiness, WordPress o reservas no aplican y se explica por qué.

---

## 1. Investigación de palabras clave

### 1.1 Análisis honesto del término "refugio"

**"refugio" a secas no es un objetivo realista ni deseable.** En Google España la SERP de "refugio" la dominan refugios de montaña, refugios de animales y acepciones climáticas. La intención de búsqueda no coincide con este sitio: el tráfico sería masivo pero irrelevante (rebote alto, cero conversión). Perseguirlo sería malgastar autoridad.

**"refugio sensorial" sí es el término cabecera ganable**: es coincidencia exacta con la marca, el dominio (`refugio-sensorial.com`) y el `<title>`. Con la base técnica ya implementada, el sitio debe ser el resultado #1 para su propia marca en semanas.

### 1.2 Mapa de palabras clave por intención

| Palabra clave | Intención | Dificultad | Página que debe posicionar |
|---|---|---|---|
| refugio sensorial | Navegacional/marca | Baja | `/` (Home) |
| espacios silenciosos autismo | Informacional-local | Media | `/espacios`, `/espacios/:ciudad` |
| sitios tranquilos para autistas [ciudad] | Local long-tail | Baja | `/espacios/:ciudad` |
| apps para TDAH / apps para autistas | Transaccional-informacional | Media-alta | `/herramientas/tdah`, `/herramientas/autismo` |
| meltdown autista | Informacional | Media | `/entender-y-prepararse/estados/meltdown` |
| shutdown autista | Informacional | Baja-media | `/entender-y-prepararse/estados/shutdown` |
| burnout autista | Informacional | Media | `/entender-y-prepararse/estados/burnout-autista` |
| masking autista / camuflaje autista | Informacional | Baja-media | `/entender-y-prepararse/masking` |
| kit sensorial / kit de bolso autismo | Informacional | Baja | `/entender-y-prepararse/kit-de-bolso` |
| técnicas de regulación sensorial | Informacional | Media | `/entender-y-prepararse/tecnicas` |
| estimulación sensorial controlada | Informacional | Media | Home + futuro artículo |
| sala de relajación / espacio sensorial en casa | Informacional | Media | Futuro artículo (calendario §3) |
| señales antes de una crisis autista | Long-tail | Baja | `/entender-y-prepararse/senales` |
| herramientas dislexia / TOC | Transaccional | Baja-media | `/herramientas/dislexia`, `/herramientas/toc` |

**Priorización:** (1) marca, (2) los estados —meltdown/shutdown/burnout— y masking, donde el contenido ya es profundo y la competencia en español es débil, (3) apps por perfil ND, (4) espacios por ciudad a medida que crezca el mapa.

### 1.3 Long-tails recomendadas (contenido futuro)
- "cómo ayudar a una persona autista durante un meltdown"
- "diferencia entre meltdown y rabieta"
- "cómo montar un espacio sensorial en casa con poco presupuesto"
- "qué llevar en el bolso si eres autista"
- "apps gratuitas para concentrarse con TDAH"
- "burnout autista en adultos síntomas"
- "tapones y auriculares para hipersensibilidad auditiva"
- "lugares tranquilos en Madrid para personas autistas"

---

## 2. Optimización on-page — estado y criterio

**Ya implementado** (auditable en el código):
- ✅ Meta títulos y descripciones únicos por página vía `usePageMeta` (18+ páginas), con patrón `Keyword principal — matiz | Refugio Sensorial`.
- ✅ URLs semánticas y jerárquicas (`/entender-y-prepararse/estados/meltdown`).
- ✅ Canonical por página, `noIndex` en la 404, Open Graph y Twitter Cards.
- ✅ H1 único por página; jerarquía H2/H3 con `aria-labelledby`.
- ✅ Migas de pan visibles + `BreadcrumbList` JSON-LD.

**Criterio anti-sobreoptimización:** las keywords van en `<title>`, meta description, H1 y de forma natural en el primer párrafo. No se repite la keyword en cada H2 ni se añade texto "para SEO" que un lector neurodivergente no necesite: la claridad del contenido ES la estrategia (E-E-A-T: experiencia real de la autora, contenido útil primero).

---

## 3. Estrategia de contenido — calendario editorial (10 piezas)

El sitio no tiene blog como tal; las piezas encajan como páginas dentro de `/entender-y-prepararse` (ya funciona como hub de contenido). CTA estándar al final de cada pieza: enlazar al Kit (`/kit`), a Herramientas filtradas o al canal de WhatsApp/Instagram del footer.

| # | Título propuesto | Keyword objetivo | Esquema | CTA |
|---|---|---|---|---|
| 1 | Cómo montar un espacio sensorial en casa (con poco presupuesto) | espacio sensorial en casa | Qué es → principios (luz/sonido/tacto) → por presupuesto (0€/50€/150€) → errores comunes | Herramientas > Regulación |
| 2 | Meltdown vs. rabieta: cómo diferenciarlos y por qué importa | diferencia meltdown rabieta | Definiciones → tabla comparativa → qué hacer en cada caso → mitos | Página Meltdown |
| 3 | Guía de auriculares y tapones para hipersensibilidad auditiva | tapones ruido autismo | Tipos → cuándo usar cada uno → tabla comparativa (Loop, etc.) → dónde comprar | Herramientas > Auditivo |
| 4 | Cómo ayudar a tu hijo/a durante una crisis sensorial | ayudar niño crisis sensorial | Antes (señales) → durante (qué hacer/evitar) → después (recuperación) | Señales + Técnicas |
| 5 | Burnout autista en adultos: síntomas y recuperación | burnout autista adultos | Qué es → diferencias con depresión → síntomas → plan de recuperación | Página Burnout |
| 6 | Apps gratuitas para concentrarse con TDAH (probadas) | apps concentración TDAH | Selección de la biblioteca → para qué sirve cada una → cómo empezar | Herramientas > TDAH |
| 7 | Estimulación sensorial controlada: qué es y cómo aplicarla | estimulación sensorial | Concepto → hipo vs. hipersensibilidad → actividades por sentido | Kit sensorial |
| 8 | Viajar siendo autista: preparar el viaje sin sobrecarga | viajar autismo consejos | Antes → transporte → alojamiento → kit de viaje | Kit de bolso |
| 9 | Cómo explicar tu neurodivergencia en el trabajo | autismo en el trabajo | Decidir si contarlo → a quién → guiones de ejemplo → derechos (España) | Herramientas > Laboral |
| 10 | Espacios silenciosos en [Madrid/Barcelona/Valencia]: guía | lugares tranquilos autismo [ciudad] | Serie por ciudad usando datos del mapa → mejores horas → cómo contribuir | Mapa |

**Multimedia:** las infografías (Meltdown/Shutdown/Burnout) ya existen — incrustarlas en las piezas con `alt` descriptivo. El TTS ya implementado (botón de audio) es un diferenciador de permanencia; mantenerlo en cada pieza nueva.

---

## 4. Datos estructurados — implementado y por qué

| Schema | Estado | Justificación |
|---|---|---|
| `WebSite` + `SearchAction` | ✅ ya en `index.html` | Sitelinks search box |
| `Organization` | ✅ ya en `index.html` | Entidad de marca (no LocalBusiness: **no hay sede física** — usar LocalBusiness sin dirección real violaría las directrices) |
| `BreadcrumbList` | ✅ componente Breadcrumb | Migas en la SERP |
| `Article` | ✅ **nuevo** — páginas de contenido (masking, estados, señales, técnicas, kit de bolso) vía `articleLd()` en `src/lib/seo.js` | Elegibilidad para resultados enriquecidos de artículos |
| `FAQPage` | ❌ descartado | Desde 2023 Google solo muestra rich results de FAQ a sitios gubernamentales/sanitarios; marcar contenido que no es Q&A visible violaría las directrices |
| `Product`/`Service` | ❌ no aplica | No se venden sesiones ni servicios |

`datePublished` se omite deliberadamente en `Article`: no hay fechas reales de publicación registradas y fabricarlas es peor que omitirlas. Si se empieza a registrar fecha por pieza, añadirla en `articleLd()`.

---

## 5. SEO técnico y rendimiento — estado

- ✅ `robots.txt` con sitemap del dominio propio; `Disallow: /assets/`.
- ✅ `sitemap.xml` con las rutas indexables (masking añadida en esta iteración).
- ✅ Dominio propio con HTTPS, `base: '/'`, redirect SPA 404 (nota: GitHub Pages devuelve 404→200 tras redirect; las rutas del sitemap son las que Google indexa directamente).
- ✅ Code-splitting por rutas (manualChunks: three/leaflet/motion/router), imágenes lazy, logos como assets propios.
- ✅ CSP estricta, SRI en Leaflet, accesibilidad WCAG 2.2 AA (declaración en `/accesibilidad`) — señales de calidad E-E-A-T.
- ⚠️ Mejora pendiente (opcional): convertir `logo.png`/`logo-icon.png` (2 MB) a WebP ≤100 KB; hoy solo afectan a og:image, no al render.
- ⚠️ Limitación asumida: al ser SPA, el HTML inicial es el de `index.html` y el contenido se hidrata en cliente. Googlebot renderiza JS y el sitio indexa bien, pero si algún día se quiere HTML estático por ruta, el salto sería a prerendering (vite-plugin-ssr/Astro) — **no** recomendado ahora: coste alto, beneficio marginal con el tamaño actual.

---

## 6. Enlazado

### Interno (ya practicado, mantener)
- Hub `/entender-y-prepararse` → radios (estados, señales, técnicas, kit, masking, guías); `RelatedContent` en páginas de estado; CTAs cruzados entre Kit ↔ Herramientas ↔ Mapa. Regla: toda pieza nueva enlaza a 2-3 páginas existentes y recibe enlace desde el hub.

### Externo (fuentes realistas en España)
- Confederación Autismo España y federaciones autonómicas (directorios de recursos)
- Asociaciones locales (Autismo Madrid, Autismo Sevilla, Aspau…) — muchas mantienen páginas de "recursos"
- Plena Inclusión, Fundación Adecco (guías de recursos)
- Blogs/cuentas de divulgación ND en español (colaboraciones de contenido)
- Prensa local cuando el mapa tenga masa crítica en una ciudad ("un mapa colaborativo de espacios tranquilos")

**Plantilla de contacto (adaptar):**
> Asunto: Recurso gratuito para vuestra página de recursos — Refugio Sensorial
>
> Hola, soy Almudena, creadora de Refugio Sensorial (refugio-sensorial.com), un proyecto sin ánimo de lucro con un mapa colaborativo de espacios tranquilos, +85 herramientas digitales clasificadas por perfil neurodivergente y guías sobre meltdown, burnout y masking, todo gratuito y accesible (WCAG 2.2 AA). Creo que puede ser útil para las familias que atendéis. Si os parece valioso, ¿lo añadiríais a vuestra sección de recursos? Encantada de colaborar en lo que necesitéis.

---

## 7. Monitorización

**Herramientas (gratuitas, suficientes para esta escala):**
1. **Google Search Console** — la verificación (`googled79dac902b2e21a3.html`) ya está desplegada. Pasos: añadir propiedad de dominio `refugio-sensorial.com` → enviar `https://www.refugio-sensorial.com/sitemap.xml` → revisar Cobertura.
2. **Bing Webmaster Tools** — importa la config de GSC en 2 clics.
3. Analytics: si se quiere medir tráfico, usar una opción sin cookies compatible con la CSP (Plausible/GoatCounter requieren añadir su dominio a `connect-src`). Decisión pendiente del propietario — no instalado por defecto por privacidad.

**KPI y ritmo de revisión (mensual):**
| KPI | Fuente | Objetivo 3 meses | Objetivo 6 meses |
|---|---|---|---|
| Posición "refugio sensorial" | GSC | #1 | #1 |
| Clics orgánicos/mes | GSC | 200 | 800 |
| Páginas indexadas | GSC Cobertura | 26/27 | 35+ (con contenido nuevo) |
| CTR medio | GSC | >3% | >5% |
| Keywords en top-10 | GSC | 10 | 30 |
| Enlaces externos (dominios) | GSC Enlaces | 5 | 15 |

---

## 8. Checklist ejecutable

**Hecho en el código (esta iteración y anteriores):**
- [x] Metas únicos por página, canonical, OG/Twitter
- [x] Sitemap + robots en dominio propio; masking añadida al sitemap
- [x] JSON-LD: WebSite, Organization, BreadcrumbList
- [x] JSON-LD Article en las 8 páginas de contenido (5 estáticas + 3 estados)
- [x] Rendimiento: code-splitting, lazy images, assets propios

**Tareas manuales del propietario (orden recomendado):**
- [ ] GSC: verificar propiedad y enviar sitemap (15 min) ← **la de mayor impacto inmediato**
- [ ] Bing Webmaster Tools: importar desde GSC (5 min)
- [ ] Publicar 1 pieza del calendario editorial al mes (empezar por #1 o #5)
- [ ] Primera ronda de outreach: 5 asociaciones con la plantilla de §6 (1 h)
- [ ] Compartir cada pieza nueva en el canal de WhatsApp e Instagram (señales sociales + tráfico directo)
- [ ] Revisar KPIs en GSC el día 1 de cada mes (§7)
- [ ] (Opcional) Convertir logos PNG pesados a WebP
- [ ] (Opcional) Decidir sobre analytics respetuoso con privacidad
