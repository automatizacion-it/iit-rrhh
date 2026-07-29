# CLAUDE.md — IIT RRHH · Sistema de Recursos Humanos
> Archivo de continuidad para sesiones Claude. Actualizar con cada cambio significativo.
> Última actualización: 2026-07-28 · v2.3

---

## 1. Descripción del proyecto

Sistema de Recursos Humanos web para InfraestructuraIT (IIT), construido en **vanilla HTML/CSS/JS sin frameworks**, desplegado en **Azure Static Web Apps** con **Supabase** como backend (PostgreSQL + REST API).

- **Producción:** https://wonderful-island-0960e8a10.7.azurestaticapps.net/
- **Repo:** https://github.com/automatizacion-it/iit-rrhh
- **Local:** `C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh`
- **Rama principal:** `main`
- **Versión actual:** v2.3
- **Carpeta de descargas:** `C:\Descargas`

---

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript ES6 (sin frameworks) |
| Estilos | CSS custom properties en `css/styles.css` (tema Fluent Design) |
| Auth | `js/auth.js` v2.0 — Supabase REST, hash demo `$demo$password` |
| Navegación | `js/sidebar.js` — sidebar con secciones desplegables, roles dinámicos |
| Hosting | Azure Static Web Apps (Free tier) |
| CI/CD | GitHub Actions — deploy automático en push a `main` |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Tabla propia `usuarios_sistema` (NO Supabase Auth) |

---

## 3. Infraestructura Azure Static Web Apps

### Datos del recurso

| Campo | Valor |
|-------|-------|
| Nombre del recurso | `wonderful-island-0960e8a10` |
| URL de producción | https://wonderful-island-0960e8a10.7.azurestaticapps.net/ |
| Plan | Free |
| Node.js | 18 (definido en `.nvmrc`) |

### GitHub Actions — workflow de deploy

**Archivo:** `.github/workflows/azure-static-web-apps-wonderful-island-0960e8a10.yml`

- **Trigger:** push a `main` o PR abierto/actualizado/cerrado contra `main`
- **Runner:** `ubuntu-latest`
- **Action:** `Azure/static-web-apps-deploy@v1`
- **`app_location`:** `/` (raíz del repo)
- **`api_location`:** vacío (no hay Azure Functions)
- **`output_location`:** vacío (sin build step — sitio estático puro)
- **`skip_app_build`:** `true` — no hay paso de compilación
- **Secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN_WONDERFUL_ISLAND_0960E8A10` (GitHub → Settings → Secrets)
- **Tiempo de deploy:** ~1 minuto tras el push

### staticwebapp.config.json

```json
{
  "routes": [
    { "route": "/pages/*", "allowedRoles": ["anonymous"] },
    { "route": "/",        "rewrite": "/index.html" }
  ],
  "responseOverrides": {
    "404": { "rewrite": "/index.html" }
  },
  "globalHeaders": {
    "Cache-Control": "no-cache"
  }
}
```

- Rutas `/pages/*` públicas — auth manejada en JS cliente
- 404 redirige a `index.html` (SPA fallback)
- `no-cache` global para reflejar cambios inmediatamente

### Comando de deploy

```powershell
cd C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh
Copy-Item "C:\Descargas\archivo.ext" "ruta\destino\archivo.ext" -Force
git add -A
git commit -m "feat: descripción - closes #N"
git push
# Azure SWA despliega en ~1 min
```

---

## 4. Supabase

- **URL:** `https://jntxowiyfwhthxhuoifb.supabase.co`
- **Anon key:** `sb_publishable_tMC3EDKF1yXy8bz_yQGDOA_IfSBvuj7`
- **REST base:** `https://jntxowiyfwhthxhuoifb.supabase.co/rest/v1`
- **SQL Editor:** `https://supabase.com/dashboard/project/jntxowiyfwhthxhuoifb/sql/new`
- **Plan:** Free (2 proyectos activos — el otro es `iit-ordenes-servicio-v2`)
- **RLS:** habilitado en todas las tablas, políticas permisivas temporales `using (true)`
- **Hash:** `'$demo$' + password` — reemplazar por bcrypt (Edge Function) en producción
- **Trigger global:** `set_updated_at()` — actualiza `updated_at` en cada UPDATE

---

## 5. Base de datos — SQLs en repositorio

> **Los scripts SQL están en `database/`** — ver `database/README.md` para instrucciones de ejecución.

### Orden de ejecución y estado

| # | Archivo | Tablas creadas | Estado |
|---|---------|---------------|--------|
| 1 | `database/01_extensiones_empleados.sql` | `empleados` + fn `set_updated_at()` | ✅ Ejecutado 2026-07-28 |
| 2 | `database/02_usuarios_sistema.sql` | `usuarios_sistema` + 4 usuarios demo + 1 empleado demo | ✅ Ejecutado 2026-07-28 |
| 3 | `database/03_modulos_tiempo.sql` | `vacaciones`, `permisos`, `ausencias`, `incapacidades`, `licencias` | ✅ Ejecutado 2026-07-28 |
| 4 | `database/04_nomina_finanzas.sql` | `nomina_periodos`, `nomina_items`, `horas_extras`, `prestamos` | ✅ Ejecutado 2026-07-28 |
| 5 | `database/05_sst_seleccion_auditoria.sql` | `arl_accidentes`, `examenes_medicos`, `aspirantes`, `contratos`, `auditoria_log` | ✅ Ejecutado 2026-07-28 |
| 6 | `database/06_tablas_pendientes.sql` | `capacitaciones`, `disciplinario`, `inventario_equipos`, `proyectos`, `estudios_seguridad`, `visitas_domiciliarias` | 🔴 Pendiente |

### Datos demo en BD

| Tabla | Registros |
|-------|-----------|
| `usuarios_sistema` | 4 (empresa, admin, usuario, empleado) |
| `empleados` | 2 (Carlos Rodríguez 1234567890 + Jairo Sepúlveda 79374699) |

### Credenciales demo

| Email | Password | Rol |
|-------|----------|-----|
| `empresa@iit.com.co` | `Iit2026*` | empresa |
| `admin@iit.com.co` | `Admin2026*` | administrador |
| `usuario@iit.com.co` | `User2026*` | usuario |
| `c.rodriguez@iit.com.co` | `Emp2026*` | empleado |

### Verificación rápida en SQL Editor

```sql
select 'usuarios_sistema' as tabla, count(*) as registros from usuarios_sistema
union all select 'empleados',     count(*) from empleados
union all select 'vacaciones',    count(*) from vacaciones
union all select 'contratos',     count(*) from contratos
union all select 'auditoria_log', count(*) from auditoria_log;
```

---

## 6. Sistema de roles

| Rol | Acceso | Credenciales demo |
|-----|--------|------------------|
| `empresa` | Total | `empresa@iit.com.co` / `Iit2026*` |
| `administrador` | Casi total | `admin@iit.com.co` / `Admin2026*` |
| `usuario` | Operativo | `usuario@iit.com.co` / `User2026*` |
| `empleado` | Solo su info | `c.rodriguez@iit.com.co` / `Emp2026*` |

**Sesión:** `localStorage` clave `iit_rrhh_session`  
**Redirect post-login:** `/pages/dashboard.html`

---

## 7. Estructura de archivos

```
iit-rrhh/
├── CLAUDE.md
├── index.html                  # Login principal
├── favicon.svg
├── .nojekyll
├── .nvmrc                      # Node 18
├── staticwebapp.config.json
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-wonderful-island-0960e8a10.yml
├── css/
│   └── styles.css              # Variables CSS Fluent Design
├── js/
│   ├── auth.js                 # v2.0 Supabase REST + Auth.db.*
│   └── sidebar.js              # Menú lateral dinámico por rol
├── database/                   # ← SQLs de la BD
│   ├── README.md               # Instrucciones de ejecución
│   ├── 01_extensiones_empleados.sql
│   ├── 02_usuarios_sistema.sql
│   ├── 03_modulos_tiempo.sql
│   ├── 04_nomina_finanzas.sql
│   ├── 05_sst_seleccion_auditoria.sql
│   └── 06_tablas_pendientes.sql
└── pages/                      # 40 páginas
```

---

## 8. Páginas — estado de conexión a Supabase

### ✅ Conectadas (datos reales)

| Página | Operaciones Supabase |
|--------|---------------------|
| `index.html` | SELECT `usuarios_sistema`, UPDATE `ultimo_acceso`, INSERT `auditoria_log` |
| `pages/nuevo-empleado.html` | INSERT `empleados` + INSERT `usuarios_sistema` + INSERT `auditoria_log` |
| `pages/sabana.html` | SELECT `empleados` (filtros, métricas, paginación, export TSV) |

### 🔴 Pendientes (datos hardcodeados)

`dashboard.html`, `empleados.html`, `mi-perfil.html`, `mis-documentos.html`,
`vacaciones.html`, `permisos.html`, `permisos-remunerados.html`, `ausencias.html`,
`incapacidades.html`, `licencias.html`, `asistencia.html`, `nomina.html`,
`horas-extras.html`, `liquidacion.html`, `seguridad-social.html`, `prestamos.html`,
`arl.html`, `examenes-medicos.html`, `incentivos.html`, `disciplinario.html`,
`convivencia.html`, `asistente-ia.html`, `aspirantes.html`, `contratos.html`,
`clausulas.html`, `capacitaciones.html`, `seguridad.html`, `validacion-identidad.html`,
`visita-domiciliaria.html`, `socializacion.html`, `usuarios.html`, `config-empresa.html`,
`inventario-equipos.html`, `proyectos.html`, `informes.html`, `sugerencias-jefe.html`,
`auditoria.html`, `backup.html`

---

## 9. API de datos — Auth.db.*

```javascript
// SELECT con filtros PostgREST
Auth.db.query('empleados',
  { 'estado': 'eq.activo' },    // filtros
  'id,nombres,apellidos,cargo', // columnas (null = *)
  'apellidos.asc',              // orden
  100                           // límite
).then(function(rows) { /* array */ });

// SELECT simple
Auth.db.get('empleados', { 'cedula': 'eq.79374699', 'select': '*' });

// INSERT — retorna array con el registro creado
Auth.db.insert('vacaciones', { empleado_id: 'uuid', fecha_inicio: '2026-08-01' });

// UPDATE por filtro
Auth.db.update('vacaciones', { id: 'uuid' }, { estado: 'aprobado' });

// DELETE
Auth.db.delete('aspirantes', { id: 'uuid' });
```

**Filtros PostgREST frecuentes:**
`eq.` igual · `neq.` distinto · `gte.` mayor-igual · `lte.` menor-igual · `ilike.*x*` contiene · `in.(a,b)` en lista

---

## 10. Patrones de código — página tipo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Módulo] — IIT RRHH</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/sidebar.js"></script>
</head>
<body>
<div class="app-layout">
  <header class="topbar">
    <a href="/pages/dashboard.html" class="topbar-logo">
      <div class="logo-icon">IIT</div><span class="logo-main">RRHH</span>
    </a>
    <div class="topbar-right">
      <span class="topbar-badge" id="topbar-badge"></span>
      <span class="topbar-name"  id="topbar-name"></span>
      <div class="topbar-avatar" id="topbar-avatar" onclick="Auth.logout()" title="Cerrar sesión"></div>
    </div>
  </header>
  <nav class="sidebar" id="main-sidebar"></nav>
  <main class="main-content">
    <div class="page-header">
      <div><div class="page-title">Título</div><div class="page-sub">Descripción</div></div>
    </div>
  </main>
</div>
<script src="/js/auth.js"></script>
<script>
  var session = Auth.requireAuth();
  Sidebar.render('main-sidebar', session);
  Auth.renderUserBar(session);
</script>
</body>
</html>
```

### Clases CSS frecuentes
`.card` · `.card-header` · `.card-title` · `.table-wrap` · `.metrics-grid` · `.metric-card`
`.metric-value` · `.metric-label` · `.field-group` · `.field-label` · `.field-input`
`.btn-primary` · `.btn-secondary` · `.btn-sm` · `.btn-group`
`.alert` · `.alert-error` · `.alert-warning` · `.alert-info`
`.badge` · `.badge-ok` · `.badge-warning` · `.badge-danger` · `.badge-muted`
`.form-grid` · `.span-2` · `.modal-overlay` · `.modal` · `.hidden`
`.pagination` · `.page-btns` · `.page-btn.active`

---

## 11. Variables CSS (Fluent Design — NO dark cyberpunk)

```css
--primary:#0078d4  --primary-dark:#005a9e  --primary-light:#e6f2fb
--success:#107c10  --warning:#797600       --danger:#c50f1f
--bg:#f3f2f1       --bg-card:#ffffff       --bg-sidebar:#1b1b1b
--border:#e1dfdd   --border-dark:#c8c6c4   --text-muted:#605e5c
--radius:6px       --radius-lg:10px        --sidebar-w:220px
--topbar-h:52px    --font:'Segoe UI',system-ui
```

---

## 12. Convención de issues

```powershell
gh issue create --title "feat: descripción" --body "Detalle"
# → implementar → actualizar CLAUDE.md sección 13 → commit → push
git commit -m "feat: descripción - closes #N"
git push
```

---

## 13. Historial de cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-07-28 | v1.0 | Proyecto inicial — 40 páginas scaffolding, auth demo, Azure SWA live |
| 2026-07-28 | v2.0 | `auth.js` v2.0 — Supabase REST, reemplaza DEMO_USERS |
| 2026-07-28 | v2.0 | Supabase: 16 tablas creadas (5 bloques SQL ejecutados), RLS habilitado |
| 2026-07-28 | v2.0 | Datos demo: 4 usuarios + Carlos Rodríguez en `empleados` |
| 2026-07-28 | v2.0 | Vinculación `empleado_id` en `usuarios_sistema` ejecutada |
| 2026-07-28 | v2.0 | `nuevo-empleado.html` → INSERT real en `empleados` + `usuarios_sistema` |
| 2026-07-28 | v2.1 | `sabana.html` → SELECT real, filtros, métricas dinámicas, export TSV |
| 2026-07-28 | v2.1 | Prueba exitosa: Jairo Sepúlveda (79374699) creado en BD |
| 2026-07-28 | v2.2 | `CLAUDE.md` — documentación Azure SWA, workflow CI/CD completo |
| 2026-07-28 | v2.3 | Carpeta `database/` con 6 SQLs versionados + `database/README.md` |

---

## 14. Próximos pasos

### 🔴 Prioridad inmediata
1. `database/06_tablas_pendientes.sql` — ejecutar en Supabase cuando se implementen esos módulos
2. `dashboard.html` — KPIs reales desde Supabase
3. `empleados.html` — directorio con cards conectado a Supabase
4. `mi-perfil.html` — perfil por `?cedula=` desde Supabase

### 🟡 Siguiente fase
5. Módulos de Tiempo — CRUD real (vacaciones, permisos, ausencias)
6. Nómina 2026 — SMM $1.423.500, aux. transporte $200.000
7. `asistente-ia.html` — Claude API integrado
8. Hash bcrypt real via Supabase Edge Function
9. `usuarios.html` — CRUD de usuarios del sistema
