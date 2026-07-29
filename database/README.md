# IIT RRHH — Base de datos Supabase

## Conexión
- **Proyecto:** `iit-rrhh`
- **URL:** `https://jntxowiyfwhthxhuoifb.supabase.co`
- **SQL Editor:** `https://supabase.com/dashboard/project/jntxowiyfwhthxhuoifb/sql/new`

## Orden de ejecución

Ejecutar en el SQL Editor de Supabase **en este orden exacto**:

| # | Archivo | Tablas | Estado |
|---|---------|--------|--------|
| 1 | `01_extensiones_empleados.sql` | `empleados` + función `set_updated_at()` | ✅ Ejecutado 2026-07-28 |
| 2 | `02_usuarios_sistema.sql` | `usuarios_sistema` + datos demo | ✅ Ejecutado 2026-07-28 |
| 3 | `03_modulos_tiempo.sql` | `vacaciones`, `permisos`, `ausencias`, `incapacidades`, `licencias` | ✅ Ejecutado 2026-07-28 |
| 4 | `04_nomina_finanzas.sql` | `nomina_periodos`, `nomina_items`, `horas_extras`, `prestamos` | ✅ Ejecutado 2026-07-28 |
| 5 | `05_sst_seleccion_auditoria.sql` | `arl_accidentes`, `examenes_medicos`, `aspirantes`, `contratos`, `auditoria_log` | ✅ Ejecutado 2026-07-28 |
| 6 | `06_tablas_pendientes.sql` | `capacitaciones`, `disciplinario`, `inventario_equipos`, `proyectos`, `estudios_seguridad`, `visitas_domiciliarias` | 🔴 Pendiente |

## Datos demo insertados

| Tabla | Registros |
|-------|-----------|
| `usuarios_sistema` | 4 usuarios (empresa, admin, usuario, empleado) |
| `empleados` | Carlos Rodríguez (1234567890) + Jairo Sepúlveda (79374699, creado en prueba) |

## Credenciales demo

| Email | Password | Rol |
|-------|----------|-----|
| `empresa@iit.com.co` | `Iit2026*` | empresa |
| `admin@iit.com.co` | `Admin2026*` | administrador |
| `usuario@iit.com.co` | `User2026*` | usuario |
| `c.rodriguez@iit.com.co` | `Emp2026*` | empleado |

## Verificación rápida

```sql
select 'usuarios_sistema' as tabla, count(*) as registros from usuarios_sistema
union all select 'empleados',  count(*) from empleados
union all select 'vacaciones', count(*) from vacaciones
union all select 'contratos',  count(*) from contratos
union all select 'auditoria_log', count(*) from auditoria_log;
```

## Notas

- RLS habilitado en todas las tablas con políticas permisivas temporales (`using (true)`)
- Hash de contraseñas formato demo: `'$demo$' + password` — reemplazar por bcrypt (Edge Function) en producción
- La función `set_updated_at()` es global y usada por todos los triggers
- `auditoria_log` usa `bigserial` como PK (no UUID) para rendimiento en escrituras masivas
