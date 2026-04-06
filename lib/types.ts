export interface Producto {
  id: string
  nombre: string
  categoria: string
  precio: number
  material: string | null
  coordenadas_diseno: string | null
  imagen_url: string | null
  descripcion: string | null
  created_at: string
}

export type ProductoInsert = Omit<Producto, 'id' | 'created_at'>
export type ProductoUpdate = Partial<ProductoInsert>

export const CATEGORIAS = ['Mobiliario', 'Estructura', 'Remodelación'] as const
export type Categoria = typeof CATEGORIAS[number]

export interface Herramienta {
  id: string
  nombre: string
  categoria: string
  precio_dia: number
  descripcion?: string
  imagen_url?: string
  estado: 'disponible' | 'mantenimiento' | 'no_disponible'
  created_at: string
}

export interface Reserva {
  id: string
  herramienta_id: string
  fecha_inicio: string
  fecha_fin: string
  cliente_nombre: string
  cliente_telefono?: string
  cliente_email?: string
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  notas?: string
  created_at: string
  herramienta?: Herramienta
}

export type EstadoHerramienta = Herramienta['estado']
export type EstadoReserva = Reserva['estado']
