-- ============================================================
-- IIT RRHH · BLOQUE 6 — Tablas pendientes de crear
-- Estado: PENDIENTE — no ejecutado aún
-- Ejecutar cuando se implementen los módulos correspondientes
-- ============================================================

-- capacitaciones
create table capacitaciones (
  id            uuid primary key default uuid_generate_v4(),
  titulo        varchar(200) not null,
  descripcion   text,
  fecha_inicio  date,
  fecha_fin     date,
  horas         numeric(5,2),
  modalidad     varchar(40) default 'presencial', -- presencial | virtual | mixta
  instructor    varchar(120),
  estado        varchar(30) default 'programada', -- programada | en_curso | completada | cancelada
  created_at    timestamptz default now()
);

create table capacitaciones_empleados (
  id               uuid primary key default uuid_generate_v4(),
  capacitacion_id  uuid not null references capacitaciones(id) on delete cascade,
  empleado_id      uuid not null references empleados(id) on delete cascade,
  estado           varchar(30) default 'inscrito', -- inscrito | completado | no_asistio
  calificacion     numeric(4,2),
  certificado_url  text,
  created_at       timestamptz default now()
);

-- disciplinario
create table disciplinario (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60), -- llamado_atencion | memo | suspension | descargo | terminacion
  motivo        text,
  fecha         date,
  estado        varchar(30) default 'abierto',
  documento_url text,
  created_at    timestamptz default now()
);

-- inventario_equipos
create table inventario_equipos (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid references empleados(id) on delete set null,
  nombre        varchar(120) not null,
  serial        varchar(80),
  marca         varchar(80),
  modelo        varchar(80),
  tipo          varchar(60), -- laptop | celular | herramienta | vehiculo | otro
  estado        varchar(30) default 'activo',
  fecha_asignacion date,
  fecha_devolucion date,
  observaciones text,
  created_at    timestamptz default now()
);

-- proyectos
create table proyectos (
  id            uuid primary key default uuid_generate_v4(),
  nombre        varchar(200) not null,
  cliente       varchar(120),
  descripcion   text,
  fecha_inicio  date,
  fecha_fin     date,
  estado        varchar(30) default 'activo',
  created_at    timestamptz default now()
);

create table proyectos_empleados (
  id           uuid primary key default uuid_generate_v4(),
  proyecto_id  uuid not null references proyectos(id) on delete cascade,
  empleado_id  uuid not null references empleados(id) on delete cascade,
  rol          varchar(80),
  fecha_inicio date,
  fecha_fin    date,
  created_at   timestamptz default now()
);

-- estudios_seguridad
create table estudios_seguridad (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  tipo          varchar(60), -- antecedentes | visita_domiciliaria | referencias
  resultado     varchar(40) default 'pendiente', -- apto | no_apto | pendiente
  nivel_riesgo  varchar(20), -- bajo | medio | alto
  observaciones text,
  fecha         date,
  created_at    timestamptz default now()
);

-- visitas_domiciliarias
create table visitas_domiciliarias (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  fecha         date,
  visitador     varchar(120),
  direccion     text,
  resultado     varchar(40) default 'pendiente',
  informe       text,
  created_at    timestamptz default now()
);
