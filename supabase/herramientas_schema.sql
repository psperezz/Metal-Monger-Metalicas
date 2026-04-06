-- ============================================================
-- M3 Metal-Monger — Esquema de Alquiler de Herramientas
-- ============================================================

-- Tabla de herramientas disponibles para alquiler
create table if not exists public.herramientas (
  id                 uuid        not null default gen_random_uuid() primary key,
  nombre             text        not null,
  categoria          text        not null default 'General',
  precio_dia         numeric     not null default 0,
  descripcion        text,
  imagen_url         text,
  estado             text        not null default 'disponible' check (estado in ('disponible', 'mantenimiento', 'no_disponible')),
  created_at         timestamptz not null default now()
);

-- Tabla de reservas/calendario de disponibilidad
create table if not exists public.reservas (
  id                 uuid        not null default gen_random_uuid() primary key,
  herramienta_id     uuid        not null references public.herramientas(id) on delete cascade,
  fecha_inicio       date        not null,
  fecha_fin          date        not null,
  cliente_nombre     text        not null,
  cliente_telefono text,
  cliente_email    text,
  estado             text        not null default 'confirmada' check (estado in ('pendiente', 'confirmada', 'cancelada', 'completada')),
  notas              text,
  created_at         timestamptz not null default now(),
  -- Evitar reservas que se solapen para la misma herramienta
  constraint fechas_validas check (fecha_fin >= fecha_inicio)
);

-- Índice para búsquedas rápidas por fechas
CREATE INDEX IF NOT EXISTS idx_reservas_herramienta_fechas 
ON public.reservas(herramienta_id, fecha_inicio, fecha_fin);

-- Row Level Security
alter table public.herramientas enable row level security;
alter table public.reservas enable row level security;

-- Herramientas: lectura pública
CREATE POLICY "Herramientas lectura pública" ON public.herramientas
  FOR SELECT USING (true);

-- Herramientas: modificación solo autenticada (admin)
CREATE POLICY "Herramientas inserción autenticada" ON public.herramientas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Herramientas actualización autenticada" ON public.herramientas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Herramientas eliminación autenticada" ON public.herramientas
  FOR DELETE USING (auth.role() = 'authenticated');

-- Reservas: lectura pública (para ver disponibilidad)
CREATE POLICY "Reservas lectura pública" ON public.reservas
  FOR SELECT USING (true);

-- Reservas: creación pública (clientes pueden reservar)
CREATE POLICY "Reservas creación pública" ON public.reservas
  FOR INSERT WITH CHECK (true);

-- Reservas: modificación solo autenticada (admin)
CREATE POLICY "Reservas actualización autenticada" ON public.reservas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Reservas eliminación autenticada" ON public.reservas
  FOR DELETE USING (auth.role() = 'authenticated');

-- Función para verificar disponibilidad
create or replace function public.verificar_disponibilidad(
  p_herramienta_id uuid,
  p_fecha_inicio date,
  p_fecha_fin date,
  p_excluir_reserva_id uuid default null
)
returns boolean
language plpgsql
as $$
begin
  return not exists (
    select 1 from public.reservas r
    where r.herramienta_id = p_herramienta_id
      and r.estado in ('confirmada', 'pendiente')
      and (
        p_fecha_inicio between r.fecha_inicio and r.fecha_fin
        or p_fecha_fin between r.fecha_inicio and r.fecha_fin
        or (p_fecha_inicio <= r.fecha_inicio and p_fecha_fin >= r.fecha_fin)
      )
      and (p_excluir_reserva_id is null or r.id != p_excluir_reserva_id)
  );
end;
$$;

-- Trigger para validar disponibilidad antes de insertar/actualizar
create or replace function public.validar_disponibilidad_reserva()
returns trigger
language plpgsql
as $$
begin
  if not public.verificar_disponibilidad(
    NEW.herramienta_id,
    NEW.fecha_inicio,
    NEW.fecha_fin,
    case when TG_OP = 'UPDATE' then OLD.id else null end
  ) then
    raise exception 'La herramienta no está disponible en las fechas seleccionadas';
  end if;
  return NEW;
end;
$$;

drop trigger if exists trigger_validar_disponibilidad on public.reservas;
create trigger trigger_validar_disponibilidad
  before insert or update on public.reservas
  for each row
  execute function public.validar_disponibilidad_reserva();

-- Datos de ejemplo: Herramientas
insert into public.herramientas (nombre, categoria, precio_dia, descripcion, estado) values
  ('Soldadora MIG 250A', 'Soldadura', 45, 'Soldadora de arco MIG con 250 amperios de potencia. Ideal para trabajos de acero estructural.', 'disponible'),
  ('Cortadora Plasma 60A', 'Corte', 55, 'Cortadora plasma CNC portátil para corte preciso en metal.', 'disponible'),
  ('Taladro Magnético 1200W', 'Perforación', 35, 'Taladro magnético industrial para perforación en acero hasta 50mm.', 'disponible'),
  ('Dobladora de Tubo Hidráulica', 'Doblado', 80, 'Dobladora hidráulica para tubos de 1/2" a 3" diámetro.', 'disponible'),
  ('Esmeril Angular Industrial', 'Desbaste', 25, 'Esmeril angular de 9" 2400W con discos abrasivos incluidos.', 'disponible'),
  ('Compresor de Aire 100L', 'Aire Comprimido', 30, 'Compresor 3HP con tanque de 100 litros, incluye manguera y pistola.', 'disponible');
