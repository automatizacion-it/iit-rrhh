-- ============================================================
-- IIT RRHH · BLOQUE 2 — Usuarios del sistema + datos demo
-- Requiere: 01_extensiones_empleados.sql ejecutado
-- Fecha: 2026-07-28
-- ============================================================

create table usuarios_sistema (
  id            uuid primary key default uuid_generate_v4(),
  empleado_id   uuid references empleados(id) on delete set null,
  cedula        varchar(20)  unique not null,
  email         varchar(120) unique not null,
  password_hash text         not null,  -- formato demo: '$demo$' + password
  rol           varchar(30)  not null default 'empleado',
                             -- empresa | administrador | usuario | empleado
  activo        boolean      default true,
  primer_acceso boolean      default true,
  ultimo_acceso timestamptz,
  created_at    timestamptz  default now(),
  updated_at    timestamptz  default now()
);

create trigger trg_usuarios_updated
  before update on usuarios_sistema
  for each row execute function set_updated_at();

alter table usuarios_sistema enable row level security;
create policy "usuarios_select" on usuarios_sistema for select using (true);
create policy "usuarios_insert" on usuarios_sistema for insert with check (true);
create policy "usuarios_update" on usuarios_sistema for update using (true);
create policy "usuarios_delete" on usuarios_sistema for delete using (true);

-- Usuarios demo iniciales
insert into usuarios_sistema (cedula, email, password_hash, rol, activo, primer_acceso) values
('0000000001', 'empresa@iit.com.co',     '$demo$Iit2026*',   'empresa',       true, false),
('0000000002', 'admin@iit.com.co',       '$demo$Admin2026*', 'administrador', true, false),
('0000000003', 'usuario@iit.com.co',     '$demo$User2026*',  'usuario',       true, false),
('1234567890', 'c.rodriguez@iit.com.co', '$demo$Emp2026*',   'empleado',      true, false);

-- Empleado demo para Carlos Rodríguez
insert into empleados (cedula, nombres, apellidos, email_corp, email_pers, telefono,
  cargo, departamento, sede, tipo_contrato, fecha_ingreso, estado, salario, eps, fondo_pension, arl)
values
('1234567890', 'Carlos', 'Rodríguez', 'c.rodriguez@iit.com.co', 'carlos.r@gmail.com', '3001234567',
 'Técnico Instalaciones', 'Instalaciones', 'Bogotá', 'indefinido', '2024-03-01', 'activo',
 2800000, 'Sanitas', 'Porvenir', 'Sura');

-- Vincular empleado_id (ejecutar después de los inserts anteriores)
update usuarios_sistema u
set empleado_id = e.id
from empleados e
where u.cedula = e.cedula;
