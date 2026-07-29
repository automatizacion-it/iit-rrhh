-- ============================================================
-- IIT RRHH · BLOQUE 4 — Nómina y Finanzas
-- Requiere: 01 y 02 ejecutados
-- Tablas: nomina_periodos, nomina_items, horas_extras, prestamos
-- Normativa colombiana 2026: SMM $1.423.500, aux. transporte $200.000
-- Fecha: 2026-07-28
-- ============================================================

create table nomina_periodos (
  id               uuid primary key default uuid_generate_v4(),
  periodo          varchar(7) not null unique, -- formato: '2026-07'
  fecha_inicio     date not null,
  fecha_fin        date not null,
  estado           varchar(30) default 'borrador', -- borrador | liquidado | pagado
  liquidado_por    uuid references usuarios_sistema(id),
  liquidado_at     timestamptz,
  total_devengado  numeric(16,2) default 0,
  total_deducciones numeric(16,2) default 0,
  total_neto       numeric(16,2) default 0,
  created_at       timestamptz default now()
);
alter table nomina_periodos enable row level security;
create policy "nomina_periodos_all" on nomina_periodos for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table nomina_items (
  id                  uuid primary key default uuid_generate_v4(),
  periodo_id          uuid not null references nomina_periodos(id) on delete cascade,
  empleado_id         uuid not null references empleados(id) on delete cascade,
  salario_base        numeric(14,2) not null,
  dias_trabajados     int default 30,
  -- Devengados
  salario_devengado   numeric(14,2) default 0,
  horas_extras_valor  numeric(14,2) default 0,
  bonificaciones      numeric(14,2) default 0,
  auxilio_transporte  numeric(14,2) default 0, -- $200.000 si salario <= 2*SMM
  otros_devengados    numeric(14,2) default 0,
  total_devengado     numeric(14,2) default 0,
  -- Deducciones empleado
  salud_empleado      numeric(14,2) default 0, -- 4% del IBC
  pension_empleado    numeric(14,2) default 0, -- 4% del IBC
  otros_descuentos    numeric(14,2) default 0,
  total_deducciones   numeric(14,2) default 0,
  neto_pagar          numeric(14,2) default 0,
  -- Aportes empresa (no afectan neto empleado)
  salud_empresa       numeric(14,2) default 0, -- 8.5% del IBC
  pension_empresa     numeric(14,2) default 0, -- 12% del IBC
  arl_empresa         numeric(14,2) default 0, -- según clase de riesgo
  caja_comp_empresa   numeric(14,2) default 0, -- 4%
  icbf_empresa        numeric(14,2) default 0, -- 3%
  sena_empresa        numeric(14,2) default 0, -- 2%
  created_at          timestamptz default now()
);
alter table nomina_items enable row level security;
create policy "nomina_items_all" on nomina_items for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table horas_extras (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  fecha         date not null,
  tipo          varchar(60) not null,
                -- diurna(+25%) | nocturna(+75%) | dominical_diurna(+75%)
                -- dominical_nocturna(+110%) | festivo_diurno(+75%) | festivo_nocturno(+110%)
  horas         numeric(5,2) not null,
  recargo       numeric(5,4), -- factor multiplicador: 1.25, 1.75, 2.0, 2.10
  valor_hora    numeric(12,2),
  valor_total   numeric(14,2),
  estado        varchar(30) default 'pendiente', -- pendiente | aprobado | rechazado | liquidado
  aprobado_por  uuid references usuarios_sistema(id),
  observaciones text,
  created_at    timestamptz default now()
);
alter table horas_extras enable row level security;
create policy "horas_extras_all" on horas_extras for all using (true);

-- ──────────────────────────────────────────────────────────────────
create table prestamos (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid not null references empleados(id) on delete cascade,
  monto         numeric(14,2) not null,
  cuotas        int not null,
  valor_cuota   numeric(14,2),
  tasa_interes  numeric(6,4) default 0,
  fecha_inicio  date not null,
  saldo         numeric(14,2),
  estado        varchar(30) default 'activo', -- activo | pagado | cancelado
  motivo        text,
  aprobado_por  uuid references usuarios_sistema(id),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create trigger trg_prestamos_updated before update on prestamos for each row execute function set_updated_at();
alter table prestamos enable row level security;
create policy "prestamos_all" on prestamos for all using (true);
