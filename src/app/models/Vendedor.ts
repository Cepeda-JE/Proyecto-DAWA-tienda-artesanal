export interface Vendedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  categoria: 'ropa' | 'accesorios' | 'alimentos' | 'otro';
  activo: boolean;
  descripcion: string;
  fechaRegistro: string;
}