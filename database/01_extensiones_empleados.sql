-- ============================================================
-- IIT RRHH · BLOQUE 1 — Extensiones + Tabla empleados (core)
-- Ejecutar primero. Todo lo demás referencia esta tabla.
-- Fecha: 2026-07-28
-- ============================================================

create extension if not exists "uuid-ossp";

-- Función global para updated_at (usada por todos los triggers)
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create table empleados (
  id            uuid primary key default uuid_generate_v4(),
  cedula        varchar(20)  unique not null,
  nombres       varchar(100) not null,
  apellidos     varchar(100) not null,
  email_corp    varchar(120) unique,
  email_pers    varchar(120),
  telefono      varchar(20),
  celular       varchar(20),
  fecha_nac     date,
  genero        varchar(20),
  estado_civil  varchar(30),
  direccion     text,
  ciudad        varchar(80),
  foto_url      text,

  -- Vinculación laboral
  cargo         varchar(120),
  departamento  varchar(80),
  sede          varchar(80)  default 'Bogotá',
  tipo_contrato varchar(40),   -- indefinido | fijo | obra | aprendizaje | prestacion
  fecha_ingreso date,
  fecha_retiro  date,
  estado        varchar(30)  default 'activo', -- activo | retirado | vacaciones | incapacitado | licencia
  salario       numeric(14,2),
  banco         varchar(80),
  cuenta_banco  varchar(40),
  tipo_cuenta   varchar(20),

  -- Seguridad social
  eps           varchar(80),
  fondo_pension varchar(80),
  arl           varchar(80),
  caja_comp     varchar(80),

  -- Educación y emergencias
  educacion     varchar(80),
  contacto_emergencia_nombre     varchar(100),
  contacto_emergencia_tel        varchar(20),
  contacto_emergencia_parentesco varchar(40),

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger trg_empleados_updated
  before update on empleados
  for each row execute function set_updated_at();

alter table empleados enable row level security;
create policy "empleados_select" on empleados for select using (true);
create policy "empleados_insert" on empleados for insert with check (true);
create policy "empleados_update" on empleados for update using (true);
create policy "empleados_delete" on empleados for delete using (true);
