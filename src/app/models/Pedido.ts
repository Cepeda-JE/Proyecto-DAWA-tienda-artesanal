export interface Pedido {
  id?: number;
  numeroPedido: string;
  clienteId: number;
  productoId: number;
  cantidad: number;
  fecha: string;
  estado: string;
  total: number;
  notas: string;
}