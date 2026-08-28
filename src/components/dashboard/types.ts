export interface CortesNuevos {
  id: number | string,
  nombre: string,
  kg: number,
  precio_por_kg: number
}

export interface Corte {
  id: string;
  nombre: string;
  kgTotal: number;
  precioPorKg: number;
  creado_en: string;
  kgVendido: number;
  kgRestante: number,
  ingreso: number,
  diasSinMovimiento: number
};

export interface ResData {
  id: string;
  proveedor: string;
  fecha: string;
  pesoKg: number;
  precioPorKg: number;
};

export interface ResHistorial {
  id: string;
  proveedor: string;
  fecha_compra: string;
  peso_total: number;
  precio_kg: number;
  despostada: boolean;
};

export interface Venta {
  id: number, 
  kg_vendido: number,
  precio_por_kg: number,
  fecha_venta: string
};