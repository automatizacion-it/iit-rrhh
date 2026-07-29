-- ============================================================
-- IIT RRHH · BLOQUE 5 — SST, Selección y Auditoría
-- Requiere: 01 y 02 ejecutados
-- Tablas: arl_accidentes, examenes_medicos, aspirantes, contratos, auditoria_log
-- Fecha: 2026-07-28
-- ============================================================

create table arl_accidentes (
  id                  uuid primary key default uuid_generate_v4(),
  empleado_id         uuid not null references empleados(id) on delete cascade,
  fecha_accidente     timestamptz not null,
  lugar               varchar(120),
  descripcion         text,
  tipo_lesion         varchar(80),
  parte_cuerpo        varchar(80),
  gravedad            varchar(30) default 'leve', -- leve | moderado | grave | mortal
  reportado_arl       boolean default false,
  numero_radicado_arl varchar(60),
  dias_incapacidad    int default 0,
  estado              varchar(30) default 'abierto', -- abierto | cerrado
  created_at          timestamptz default now()
);
alter table arl_accidentes enable row level security;
create policy "arl_all" on arl_accidentes for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table examenes_medicos (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60) not null, -- ingreso | periodico | retiro | post_incapacidad
  fecha         date not null,
  entidad       varchar(100),
  resultado     varchar(40) default 'pendiente', -- apto | apto_con_restricciones | no_apto | pendiente
  restricciones text,
  proxima_fecha date,
  created_at    timestamptz default now()
);
alter table examenes_medicos enable row level security;
create policy "examenes_all" on examenes_medicos for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table aspirantes (
  id               uuid primary key default uuid_generate_v4(),
  nombres          varchar(100) not null,
  apellidos        varchar(100) not null,
  cedula           varchar(20),
  email            varchar(120),
  telefono         varchar(20),
  cargo_aplicado   varchar(120),
  educacion        varchar(80),
  experiencia_anios int,
  salario_esperado numeric(14,2),
  habilidades      text[],
  score_ia         int,  -- 0-100 generado por Claude API
  estado           varchar(40) default 'nuevo',
                   -- nuevo | en_proceso | entrevistado | seleccionado | descartado | contratado
  fuente           varchar(60), -- referido | bolsa_empleo | web | otro
  observaciones    text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
create trigger trg_aspirantes_updated before update on aspirantes for each row execute function set_updated_at();
alter table aspirantes enable row level security;
create policy "aspirantes_all" on aspirantes for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table contratos (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(40) not null, -- indefinido | fijo | obra | aprendizaje | prestacion
  fecha_inicio  date not null,
  fecha_fin     date,  -- null = indefinido
  salario       numeric(14,2) not null,
  cargo         varchar(120),
  objeto        text,  -- para obra/prestación
  estado        varchar(30) default 'vigente', -- vigente | vencido | terminado
  documento_url text,
  created_at    timestamptz default now()
);
alter table contratos enable row level security;
create policy "contratos_all" on contratos for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table auditoria_log (
  id          bigserial primary key,
  usuario_id  uuid references usuarios_sistema(id),
  accion      varchar(60) not null, -- login | logout | create | update | delete | export
  tabla       varchar(60),
  registro_id uuid,
  descripcion text,
  ip          varchar(45),
  created_at  timestamptz default now()
);
alter table auditoria_log enable row level security;
create policy "auditoria_insert" on auditoria_log for insert with check (true);
create policy "auditoria_select" on auditoria_log for select using (true);
