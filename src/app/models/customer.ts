export interface Customer {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  password: string;
  activo: boolean;
  fechaRegistro: string;
}