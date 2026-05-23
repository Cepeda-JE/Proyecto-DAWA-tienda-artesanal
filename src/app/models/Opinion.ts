export interface Opinion {
  id?: number;
  autor: string;
  correo: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  idProducto: number;
  nombreProducto: string;
  aprobada: boolean;
}