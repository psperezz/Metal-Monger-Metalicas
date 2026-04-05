-- ============================================================
-- M3 Metal-Monger — Esquema de Base de Datos
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- Tabla de productos
create table if not exists public.productos (
  id                 uuid        not null default gen_random_uuid() primary key,
  nombre             text        not null,
  categoria          text        not null default 'Mobiliario',
  precio             numeric     not null default 0,
  material           text,
  coordenadas_diseno text,
  imagen_url         text,
  descripcion        text,
  created_at         timestamptz not null default now()
);

-- Row Level Security
alter table public.productos enable row level security;

create policy "Lectura pública" on public.productos
  for select using (true);

create policy "Inserción autenticada" on public.productos
  for insert with check (auth.role() = 'authenticated');

create policy "Actualización autenticada" on public.productos
  for update using (auth.role() = 'authenticated');

create policy "Eliminación autenticada" on public.productos
  for delete using (auth.role() = 'authenticated');

-- Datos de ejemplo
insert into public.productos (nombre, categoria, precio, material, coordenadas_diseno, descripcion) values
  (
    'Estantería Industrial Reforzada',
    'Mobiliario',
    850,
    'ASTM A36',
    '0.1807° S, 78.4678° O',
    'Estantería de acero estructural con acabado epóxico negro. Capacidad de carga 500 kg por nivel. Ideal para bodegas y tiendas.'
  ),
  (
    'Estructura Steel Frame Modular',
    'Estructura',
    4500,
    'ASTM A572',
    '2.1700° S, 79.9224° O',
    'Sistema de construcción en seco con perfiles de acero galvanizado de alta resistencia. Montaje rápido y desmontable.'
  ),
  (
    'Cocina Industrial Acero Inox',
    'Remodelación',
    2200,
    'Inox 304',
    '2.9001° S, 79.0059° O',
    'Mobiliario completo de cocina profesional en acero inoxidable grado alimenticio. Incluye tarja, mesa de trabajo y estantes.'
  ),
  (
    'Mezanine Industrial Desmontable',
    'Estructura',
    3800,
    'ASTM A36',
    '1.2491° S, 78.6168° O',
    'Sistema de entrepiso modular para naves industriales. Maximiza el uso vertical del espacio sin obra civil permanente.'
  ),
  (
    'Lockers Metálicos 6 Puertas',
    'Mobiliario',
    420,
    'CR Steel 0.9mm',
    '0.3517° N, 78.1222° O',
    'Lockers de acero laminado en frío con pintura electrostática. Incluye cerradura y ventilación. Colores a elección.'
  ),
  (
    'Pérgola Arquitectónica Exterior',
    'Remodelación',
    1850,
    'Acero A529-Gr50',
    '3.9931° S, 79.2042° O',
    'Estructura de acero para exteriores con diseño arquitectónico personalizable. Incluye acabado anticorrosivo.'
  );

-- Storage bucket para imágenes (ejecutar por separado en la consola de Supabase)
-- insert into storage.buckets (id, name, public) values ('productos', 'productos', true);
