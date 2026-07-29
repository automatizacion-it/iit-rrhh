# CLAUDE.md — IIT RRHH · Sistema de Recursos Humanos
> Archivo de continuidad para sesiones Claude. Actualizar con cada cambio significativo.
> Última actualización: 2026-07-28 · v2.1

---

## 1. Descripción del proyecto

Sistema de Recursos Humanos web para InfraestructuraIT (IIT), construido en **vanilla HTML/CSS/JS sin frameworks**, desplegado en **Azure Static Web Apps** con **Supabase** como backend (PostgreSQL + REST API).

- **Producción:** https://wonderful-island-0960e8a10.7.azurestaticapps.net/
- **Repo:** https://github.com/automatizacion-it/iit-rrhh
- **Local:** `C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh`
- **Rama principal:** `main`
- **Versión actual:** v2.1
- **Carpeta de descargas:** `C:\Descargas`

---

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript ES6 (sin frameworks) |
| Estilos | CSS custom properties en `css/styles.css` (tema Fluent Design) |
| Auth | `js/auth.js` v2.0 — Supabase REST, hash demo `$demo$password` |
| Navegación | `js/sidebar.js` — sidebar con secciones desplegables, roles dinámicos |
| Hosting | Azure Static Web Apps (Free tier) — deploy automático desde `main` |
| Base de datos | **Supabase PostgreSQL** |
| Autenticación | Tabla propia `usuarios_sistema` (NO Supabase Auth) |

---

## 3. Supabase

- **URL:** `https://jntxowiyfwhthxhuoifb.supabase.co`
- **Anon key:** `sb_publishable_tMC3EDKF1yXy8bz_yQGDOA_IfSBvuj7`
- **REST base:** `https://jntxowiyfwhthxhuoifb.supabase.co/rest/v1`
- **RLS:** habilitado en todas las tablas, políticas permisivas (se refinan con Auth real)
- **Hash actual:** `'$demo$' + password` — solo demo, reemplazar por bcrypt en producción
- **Trigger `set_updated_at()`:** función global para actualizar `updated_at` automáticamente

---

## 4. Base de datos — tablas creadas

Todas creadas el 2026-07-28 via SQL Editor de Supabase. RLS habilitado con políticas `for all using (true)`.

### Tablas operativas (16 tablas)

| Tabla | Descripción | FK principal |
|-------|-------------|-------------|
| `empleados` | Tabla core — todos la referencian | — |
| `usuarios_sistema` | Cuentas de acceso, 4 roles | `empleados.id` |
| `vacaciones` | Solicitudes de vacaciones | `empleados.id` |
| `permisos` | Permisos remunerados y no remunerados | `empleados.id` |
| `ausencias` | Registro de ausencias | `empleados.id` |
| `incapacidades` | Incapacidades médicas | `empleados.id` |
| `licencias` | Licencias (maternidad, luto, etc.) | `empleados.id` |
| `nomina_periodos` | Cabecera de períodos de nómina | — |
| `nomina_items` | Detalle de nómina por empleado | `empleados.id`, `nomina_periodos.id` |
| `horas_extras` | Registro y liquidación HE | `empleados.id` |
| `prestamos` | Préstamos a empleados | `empleados.id` |
| `arl_accidentes` | Accidentes laborales | `empleados.id` |
| `examenes_medicos` | Exámenes de ingreso/retiro/periódico | `empleados.id` |
| `aspirantes` | Candidatos con score IA | — |
| `contratos` | Contratos laborales | `empleados.id` |
| `auditoria_log` | Log de todas las acciones del sistema | `usuarios_sistema.id` |

### Tablas pendientes de crear

| Tabla | Módulo |
|-------|--------|
| `capacitaciones` | `capacitaciones.html` |
| `disciplinario` | `disciplinario.html` |
| `inventario_equipos` | `inventario-equipos.html` |
| `proyectos` + `proyectos_empleados` | `proyectos.html` |
| `estudios_seguridad` | `seguridad.html` |
| `visitas_domiciliarias` | `visita-domiciliaria.html` |
| `examenes_medicos` | `examenes-medicos.html` |

### Datos demo insertados

| Tabla | Registros |
|-------|-----------|
| `usuarios_sistema` | 4 usuarios (empresa, admin, usuario, empleado) |
| `empleados` | 2 empleados (Carlos Rodríguez + Jairo Sepúlveda — creado en prueba real) |

### Vinculación usuarios ↔ empleados

```sql
-- Ejecutado 2026-07-28: vincula empleado_id en usuarios_sistema
update usuarios_sistema u
set empleado_id = e.id
from empleados e
where u.cedula = e.cedula;
```

Resultado: solo Carlos Rodríguez quedó vinculado. Los usuarios empresa/admin/usuario no tienen ficha de empleado (normal — son administrativos).

---

## 5. Sistema de roles

| Rol | Acceso | Credenciales demo |
|-----|--------|------------------|
| `empresa` | Total | `empresa@iit.com.co` / `Iit2026*` |
| `administrador` | Casi total | `admin@iit.com.co` / `Admin2026*` |
| `usuario` | Operativo | `usuario@iit.com.co` / `User2026*` |
| `empleado` | Solo su info | `c.rodriguez@iit.com.co` / `Emp2026*` |

**Sesión:** `localStorage` clave `iit_rrhh_session`
**Redirect post-login:** `/pages/dashboard.html`

---

## 6. Estructura de archivos

```
iit-rrhh/
├── CLAUDE.md                   # Este archivo
├── index.html                  # Login principal
├── favicon.svg
├── .nojekyll
├── .nvmrc
├── staticwebapp.config.json    # Rutas Azure SWA
├── css/
│   └── styles.css              # Estilos globales + variables CSS
├── js/
│   ├── auth.js                 # v2.0 — Supabase REST + Auth.db.*
│   └── sidebar.js              # Menú lateral unificado
└── pages/                      # 40 páginas
```

---

## 7. Páginas y estado de conexión a Supabase

### ✅ Conectadas a Supabase (datos reales)

| Página | Operaciones |
|--------|-------------|
| `index.html` | Login real contra `usuarios_sistema` + log `auditoria_log` |
| `pages/nuevo-empleado.html` | INSERT en `empleados` + INSERT en `usuarios_sistema` + log auditoría |
| `pages/sabana.html` | SELECT de todos los empleados, filtros, métricas, export TSV |

### 🔴 Pendientes de conectar (aún usan datos demo hardcodeados)

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

## 8. API de datos — Auth.db.*

`auth.js` expone `Auth.db.*` para que todas las páginas usen Supabase sin fetch manual:

```javascript
// SELECT con filtros PostgREST
Auth.db.query('empleados',
  { 'estado': 'eq.activo' },     // filtros
  'id,nombres,apellidos,cargo',  // select (null = *)
  'apellidos.asc',               // order
  100                            // limit
).then(function(rows) { /* array */ });

// SELECT simple
Auth.db.get('empleados', { 'cedula': 'eq.79374699', 'select': '*' });

// INSERT — retorna array con el registro creado
Auth.db.insert('vacaciones', { empleado_id: 'uuid', fecha_inicio: '2026-08-01', ... });

// UPDATE por filtro
Auth.db.update('vacaciones', { id: 'uuid' }, { estado: 'aprobado' });

// DELETE
Auth.db.delete('aspirantes', { id: 'uuid' });
```

**Filtros PostgREST frecuentes:**
- `'estado': 'eq.activo'` → igual a
- `'salario': 'gte.2000000'` → mayor o igual
- `'nombres': 'ilike.*juan*'` → contiene (case insensitive)
- `'select': 'id,nombres,cargo'` → columnas específicas
- `'order': 'apellidos.asc'` → ordenar

---

## 9. Patrones de código — estructura de cada página

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
  <header class="topbar">...</header>
  <nav class="sidebar" id="main-sidebar"></nav>
  <main class="main-content">
    <div class="page-header">...</div>
    <!-- contenido -->
  </main>
</div>
<script src="/js/auth.js"></script>
<script>
  var session = Auth.requireAuth();
  Sidebar.render('main-sidebar', session);
  Auth.renderUserBar(session);

  // Cargar datos
  Auth.db.query('empleados', {'estado':'eq.activo'}, 'id,nombres,apellidos,cargo', 'apellidos.asc', 100)
    .then(function(rows) { /* renderizar */ });
</script>
</body>
</html>
```

### Clases utilitarias frecuentes
- `.card` / `.card-header` / `.card-title`
- `.table-wrap` → tabla con scroll horizontal
- `.metrics-grid` / `.metric-card` / `.metric-value` / `.metric-label` / `.metric-sub`
- `.field-group` / `.field-label` / `.field-input`
- `.btn-primary` / `.btn-secondary` / `.btn-sm` / `.btn-full` / `.btn-group`
- `.alert` / `.alert-error` / `.alert-warning` / `.alert-info`
- `.badge` / `.badge-ok` / `.badge-warning` / `.badge-danger` / `.badge-muted`
- `.page-header` / `.page-title` / `.page-sub`
- `.form-grid` / `.span-2`
- `.modal-overlay` / `.modal` / `.modal-header` / `.modal-body` / `.modal-footer`
- `.hidden` → display:none
- `.pagination` / `.page-btns` / `.page-btn.active`

---

## 10. Variables CSS (Fluent Design — NO el dark cyberpunk de otros proyectos IIT)

```css
--primary:       #0078d4
--primary-dark:  #005a9e
--primary-light: #e6f2fb
--success:       #107c10
--warning:       #797600
--danger:        #c50f1f
--bg:            #f3f2f1
--bg-card:       #ffffff
--bg-sidebar:    #1b1b1b
--sidebar-active:#0078d4
--radius:        6px
--radius-lg:     10px
--sidebar-w:     220px
--topbar-h:      52px
--font:          'Segoe UI', system-ui
--border:        #e1dfdd
--border-dark:   #c8c6c4
--text-muted:    #605e5c
--text-light:    #a19f9d
--transition:    all 0.15s ease
```

---

## 11. Despliegue

```powershell
cd C:\Users\User01\OneDrive\2026-proyectos\iit-rrhh

# Copiar archivo modificado desde descargas
Copy-Item "C:\Descargas\archivo.html" "pages\archivo.html" -Force
Copy-Item "C:\Descargas\auth.js"      "js\auth.js"         -Force
Copy-Item "C:\Descargas\CLAUDE.md"    "CLAUDE.md"          -Force

# Commit y push
git add -A
git commit -m "feat: descripción - closes #N"
git push
# Azure SWA despliega automáticamente en ~1 min
```

---

## 12. Convención de issues (trazabilidad)

```powershell
gh issue create --title "feat: descripción" --body "Detalle del problema o mejora"
# → implementar el cambio
git commit -m "feat: descripción - closes #N"
# → actualizar CLAUDE.md
git push
```

---

## 13. Historial de cambios

| Fecha | Versión | Cambio |
|-------|---------|--------|
| 2026-07-28 | v1.0 | Proyecto inicial — 40 páginas scaffolding, auth demo, Azure SWA |
| 2026-07-28 | v2.0 | auth.js v2.0 con Supabase REST — reemplaza DEMO_USERS |
| 2026-07-28 | v2.0 | Supabase: 16 tablas creadas (5 bloques SQL), RLS habilitado |
| 2026-07-28 | v2.0 | Datos demo: 4 usuarios + 1 empleado (Carlos Rodríguez) |
| 2026-07-28 | v2.0 | nuevo-empleado.html conectado a Supabase (INSERT real) |
| 2026-07-28 | v2.1 | sabana.html conectada a Supabase (SELECT real, filtros, métricas, export) |
| 2026-07-28 | v2.1 | Prueba real: Jairo Sepúlveda (79374699) creado exitosamente en BD |

---

## 14. Estado y próximos pasos

### ✅ Completado
- Login real contra Supabase
- 16 tablas PostgreSQL con RLS
- nuevo-empleado.html → INSERT real en empleados + usuarios_sistema
- sabana.html → SELECT real, filtros, métricas dinámicas, export TSV
- Auditoría automática en login/logout/create

### 🔴 Prioridad inmediata
1. **empleados.html** — directorio con cards, conectar a Supabase
2. **dashboard.html** — KPIs reales desde Supabase (COUNT por estado, nómina total)
3. **mi-perfil.html** — perfil del empleado por `?cedula=` desde Supabase

### 🟡 Siguiente fase
4. Módulos de Tiempo (vacaciones, permisos) — CRUD completo
5. Nómina real — cálculos colombianos 2026 (salario mínimo $1.423.500, aux. transporte $200.000)
6. Asistente IA — Claude API en `asistente-ia.html`
7. Tablas pendientes: `capacitaciones`, `disciplinario`, `inventario_equipos`, `proyectos`
8. Hash bcrypt real via Supabase Edge Function (reemplazar `$demo$`)
9. usuarios.html — CRUD de usuarios del sistema
