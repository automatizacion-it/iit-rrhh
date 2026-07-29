-- ============================================================
-- IIT RRHH · BLOQUE 3 — Módulos de Tiempo
-- Requiere: 01 y 02 ejecutados
-- Tablas: vacaciones, permisos, ausencias, incapacidades, licencias
-- Fecha: 2026-07-28
-- ============================================================

create table vacaciones (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  fecha_inicio  date not null,
  fecha_fin     date not null,
  dias_habiles  int,
  tipo          varchar(40) default 'vacaciones', -- vacaciones | compensatorio
  estado        varchar(30) default 'pendiente',  -- pendiente | aprobado | rechazado | disfrutado
  aprobado_por  uuid references usuarios_sistema(id),
  observaciones text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create trigger trg_vacaciones_updated before update on vacaciones for each row execute function set_updated_at();
alter table vacaciones enable row level security;
create policy "vacaciones_all" on vacaciones for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table permisos (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60) not null, -- calamidad | cita_medica | diligencia_personal | otro
  remunerado    boolean default false,
  fecha_inicio  timestamptz not null,
  fecha_fin     timestamptz not null,
  horas         numeric(5,2),
  motivo        text,
  estado        varchar(30) default 'pendiente',
  aprobado_por  uuid references usuarios_sistema(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create trigger trg_permisos_updated before update on permisos for each row execute function set_updated_at();
alter table permisos enable row level security;
create policy "permisos_all" on permisos for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table ausencias (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  fecha         date not null,
  tipo          varchar(60) default 'injustificada', -- injustificada | justificada
  motivo        text,
  descuenta_salario boolean default true,
  created_at    timestamptz default now()
);
alter table ausencias enable row level security;
create policy "ausencias_all" on ausencias for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table incapacidades (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60) default 'enfermedad_general',
                -- enfermedad_general | accidente_trabajo | maternidad | paternidad
  fecha_inicio  date not null,
  fecha_fin     date not null,
  dias          int,
  diagnostico   text,
  entidad       varchar(100),
  numero_radicado varchar(60),
  estado        varchar(30) default 'activa',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create trigger trg_incapacidades_updated before update on incapacidades for each row execute function set_updated_at();
alter table incapacidades enable row level security;
create policy "incapacidades_all" on incapacidades for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table licencias (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60) not null,
                -- maternidad | paternidad | luto | matrimonio | calamidad | no_remunerada
  fecha_inicio  date not null,
  fecha_fin     date not null,
  dias          int,
  remunerada    boolean default true,
  estado        varchar(30) default 'pendiente',
  aprobado_por  uuid references usuarios_sistema(id),
  observaciones text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create trigger trg_licencias_updated before update on licencias for each row execute function set_updated_at();
alter table licencias enable row level security;
create policy "licencias_all" on licencias for all using (true);
