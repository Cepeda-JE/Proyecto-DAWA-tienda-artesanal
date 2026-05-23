export interface Oferta {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: 'descuento' | 'promocion' | 'liquidacion' | 'temporada';
  descuentoPorcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  idProducto: number;
  nombreProducto: string;
}