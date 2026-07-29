# CLAUDE.md — IIT RRHH · Sistema de Recursos Humanos
> Archivo de continuidad para sesiones Claude. Actualizar con cada cambio significativo.
> Última actualización: 2026-07-28 · v2.2

---

## 1. Descripción del proyecto

Sistema de Recursos Humanos web para InfraestructuraIT (IIT), construido en **vanilla HTML/CSS/JS sin frameworks**, desplegado en **Azure Static Web Apps** con **Supabase** como backend (PostgreSQL + REST API).

- **Producción:** https://wonderful-island-0960e8a10.7.azurestaticapps.net/
- **Repo:** https://github.com/automatizacion-it/iit-rrhh
- **Local:** `C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh`
- **Rama principal:** `main`
- **Versión actual:** v2.2
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
| Región | East US 2 |
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
- **Secret usado:** `AZURE_STATIC_WEB_APPS_API_TOKEN_WONDERFUL_ISLAND_0960E8A10` (guardado en GitHub → Settings → Secrets)
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

- Todas las rutas `/pages/*` son públicas (`anonymous`) — la auth la maneja JS en cliente
- 404 redirige a `index.html` (SPA fallback)
- `Cache-Control: no-cache` global para que los cambios se reflejen inmediatamente

### Cómo hacer deploy

```powershell
cd C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh

# Copiar archivos modificados desde C:\Descargas
Copy-Item "C:\Descargas\archivo.html" "pages\archivo.html" -Force
Copy-Item "C:\Descargas\auth.js"      "js\auth.js"         -Force
Copy-Item "C:\Descargas\CLAUDE.md"    "CLAUDE.md"          -Force

# Commit y push — dispara el workflow automáticamente
git add -A
git commit -m "feat: descripción - closes #N"
git push
```

> Azure SWA despliega en ~1 min. Verificar en https://wonderful-island-0960e8a10.7.azurestaticapps.net/

---

## 4. Supabase

- **URL:** `https://jntxowiyfwhthxhuoifb.supabase.co`
- **Anon key:** `sb_publishable_tMC3EDKF1yXy8bz_yQGDOA_IfSBvuj7`
- **REST base:** `https://jntxowiyfwhthxhuoifb.supabase.co/rest/v1`
- **Plan:** Free (2 proyectos activos máximo — el otro es `iit-ordenes-servicio-v2`)
- **Región:** East US (North Virginia)
- **RLS:** habilitado en todas las tablas, políticas permisivas temporales
- **Hash actual:** `'$demo$' + password` — reemplazar por bcrypt (Edge Function) en producción
- **Trigger global:** `set_updated_at()` — actualiza `updated_at` automáticamente en UPDATE

---

## 5. Base de datos — tablas creadas

Creadas el 2026-07-28 via SQL Editor (`/sql/new`). 5 bloques ejecutados en orden.

### Bloque 1 — Extensiones + empleados
```sql
create extension if not exists "uuid-ossp";
-- Tabla: empleados (tabla core)
-- Campos: id(uuid PK), cedula(unique), nombres, apellidos, email_corp, email_pers,
--         telefono, celular, fecha_nac, genero, estado_civil, direccion, ciudad, foto_url,
--         cargo, departamento, sede, tipo_contrato, fecha_ingreso, fecha_retiro, estado,
--         salario, banco, cuenta_banco, tipo_cuenta,
--         eps, fondo_pension, arl, caja_comp,
--         educacion, contacto_emergencia_nombre, contacto_emergencia_tel,
--         contacto_emergencia_parentesco, created_at, updated_at
-- Trigger: trg_empleados_updated → set_updated_at()
-- RLS: habilitado, políticas select/insert/update/delete using(true)
```

### Bloque 2 — usuarios_sistema
```sql
-- Tabla: usuarios_sistema
-- Campos: id(uuid PK), empleado_id(FK→empleados), cedula(unique), email(unique),
--         password_hash, rol(empresa|administrador|usuario|empleado),
--         activo, primer_acceso, ultimo_acceso, created_at, updated_at
-- Datos demo insertados:
--   0000000001 | empresa@iit.com.co    | $demo$Iit2026*   | empresa
--   0000000002 | admin@iit.com.co      | $demo$Admin2026* | administrador
--   0000000003 | usuario@iit.com.co    | $demo$User2026*  | usuario
--   1234567890 | c.rodriguez@iit.com.co| $demo$Emp2026*   | empleado
```

### Bloque 3 — Tiempo
```sql
-- Tablas: vacaciones, permisos, ausencias, incapacidades, licencias
-- Todas con: empleado_id(FK cascade), estado(pendiente/aprobado/rechazado),
--            aprobado_por(FK→usuarios_sistema), created_at, updated_at
```

### Bloque 4 — Nómina y finanzas
```sql
-- Tablas: nomina_periodos, nomina_items, horas_extras, prestamos
-- nomina_items incluye: devengados, deducciones empleado, aportes empresa
-- Campos clave nómina colombiana: salud 4%/8.5%, pensión 4%/12%, ARL, caja 4%, ICBF 3%, SENA 2%
```

### Bloque 5 — SST, Selección, Auditoría
```sql
-- Tablas: arl_accidentes, examenes_medicos, aspirantes, contratos, auditoria_log
-- auditoria_log: bigserial PK, usuario_id, accion, tabla, registro_id, descripcion, ip, created_at
-- Datos: 1 empleado demo → Carlos Rodríguez (cedula: 1234567890)
```

### Vinculación ejecutada post-creación
```sql
-- Vincula empleado_id en usuarios_sistema donde cédulas coincidan
update usuarios_sistema u
set empleado_id = e.id
from empleados e
where u.cedula = e.cedula;
-- Resultado: solo c.rodriguez@iit.com.co quedó vinculado (única cédula en ambas tablas)
```

### Tablas pendientes de crear

| Tabla | Módulo asociado |
|-------|----------------|
| `capacitaciones` | `capacitaciones.html` |
| `disciplinario` | `disciplinario.html` |
| `inventario_equipos` | `inventario-equipos.html` |
| `proyectos` + `proyectos_empleados` | `proyectos.html` |
| `estudios_seguridad` | `seguridad.html` |
| `visitas_domiciliarias` | `visita-domiciliaria.html` |

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
├── staticwebapp.config.json    # Rutas + headers Azure SWA
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-wonderful-island-0960e8a10.yml
├── css/
│   └── styles.css
├── js/
│   ├── auth.js                 # v2.0 Supabase REST + Auth.db.*
│   └── sidebar.js
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
  { 'estado': 'eq.activo' },     // filtros
  'id,nombres,apellidos,cargo',  // columnas (null = *)
  'apellidos.asc',               // orden
  100                            // límite
).then(function(rows) { /* array */ });

// SELECT simple
Auth.db.get('empleados', { 'cedula': 'eq.79374699', 'select': '*' });

// INSERT — retorna array con registro creado
Auth.db.insert('vacaciones', { empleado_id: 'uuid', fecha_inicio: '2026-08-01' });

// UPDATE por filtro
Auth.db.update('vacaciones', { id: 'uuid' }, { estado: 'aprobado' });

// DELETE
Auth.db.delete('aspirantes', { id: 'uuid' });
```

**Filtros PostgREST frecuentes:**
- `'eq.valor'` → igual | `'neq.valor'` → distinto
- `'gte.valor'` → mayor o igual | `'lte.valor'` → menor o igual
- `'ilike.*texto*'` → contiene (case insensitive)
- `'in.(v1,v2)'` → en lista

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
      <div class="logo-icon">IIT</div>
      <span class="logo-main">RRHH</span>
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
      <div>
        <div class="page-title">Título del módulo</div>
        <div class="page-sub">Descripción</div>
      </div>
    </div>
    <!-- contenido -->
  </main>
</div>
<script src="/js/auth.js"></script>
<script>
  var session = Auth.requireAuth();
  Sidebar.render('main-sidebar', session);
  Auth.renderUserBar(session);

  Auth.db.query('tabla', {'estado':'eq.activo'}, 'id,campo1,campo2', 'campo1.asc', 100)
    .then(function(rows) { /* renderizar */ });
</script>
</body>
</html>
```

### Clases CSS frecuentes
`.card` · `.card-header` · `.card-title` · `.table-wrap` · `.metrics-grid` · `.metric-card`
`.metric-value` · `.metric-label` · `.field-group` · `.field-label` · `.field-input`
`.btn-primary` · `.btn-secondary` · `.btn-sm` · `.btn-group` · `.btn-full`
`.alert` · `.alert-error` · `.alert-warning` · `.alert-info`
`.badge` · `.badge-ok` · `.badge-warning` · `.badge-danger` · `.badge-muted`
`.page-header` · `.page-title` · `.page-sub` · `.form-grid` · `.span-2`
`.modal-overlay` · `.modal` · `.modal-header` · `.modal-body` · `.modal-footer`
`.hidden` · `.pagination` · `.page-btns` · `.page-btn.active`

---

## 11. Variables CSS (Fluent Design — NO dark cyberpunk)

```css
--primary: #0078d4  --primary-dark: #005a9e  --primary-light: #e6f2fb
--success: #107c10  --warning: #797600        --danger: #c50f1f
--bg: #f3f2f1       --bg-card: #ffffff        --bg-sidebar: #1b1b1b
--sidebar-active: #0078d4  --radius: 6px      --radius-lg: 10px
--sidebar-w: 220px  --topbar-h: 52px          --font: 'Segoe UI', system-ui
--border: #e1dfdd   --border-dark: #c8c6c4    --text-muted: #605e5c
--text-light: #a19f9d  --transition: all 0.15s ease
```

---

## 12. Convención de issues

```powershell
gh issue create --title "feat: descripción" --body "Detalle"
# → implementar
git commit -m "feat: descripción - closes #N"
# → actualizar CLAUDE.md sección 13
git push
```

---

## 13. Historial de cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-07-28 | v1.0 | Proyecto inicial — 40 páginas scaffolding, auth demo, Azure SWA live |
| 2026-07-28 | v2.0 | `auth.js` v2.0 — Supabase REST, reemplaza DEMO_USERS |
| 2026-07-28 | v2.0 | Supabase: 16 tablas creadas (5 bloques SQL), RLS habilitado |
| 2026-07-28 | v2.0 | Datos demo: 4 usuarios + Carlos Rodríguez en `empleados` |
| 2026-07-28 | v2.0 | Vinculación `empleado_id` en `usuarios_sistema` ejecutada |
| 2026-07-28 | v2.0 | `nuevo-empleado.html` → INSERT real en `empleados` + `usuarios_sistema` |
| 2026-07-28 | v2.1 | `sabana.html` → SELECT real, filtros, métricas dinámicas, export TSV |
| 2026-07-28 | v2.1 | Prueba exitosa: Jairo Sepúlveda (79374699) creado en BD |
| 2026-07-28 | v2.2 | `CLAUDE.md` — documentación completa Azure SWA, workflow CI/CD, BD |

---

## 14. Próximos pasos

### 🔴 Prioridad inmediata
1. `dashboard.html` — KPIs reales desde Supabase (COUNT activos, nómina total, vencimientos)
2. `empleados.html` — directorio con cards conectado a Supabase
3. `mi-perfil.html` — perfil por `?cedula=` desde Supabase

### 🟡 Siguiente fase
4. Módulos de Tiempo — CRUD real (vacaciones, permisos, ausencias)
5. Nómina 2026 — salario mínimo $1.423.500, aux. transporte $200.000
6. `asistente-ia.html` — Claude API integrado
7. Tablas pendientes: `capacitaciones`, `disciplinario`, `inventario_equipos`, `proyectos`
8. Hash bcrypt real via Supabase Edge Function
9. `usuarios.html` — CRUD de usuarios del sistema
