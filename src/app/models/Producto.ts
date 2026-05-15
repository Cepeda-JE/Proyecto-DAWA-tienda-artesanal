export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;       // 'ropa,accesorios,alimentos'
  stock: number;
  imagen: string;          // URL de imagen
  vendedorId: number;      // referencia al vendedor
  disponible: boolean;     // para eliminación lógica
}