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
