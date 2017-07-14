import { Telefono } from './telefono'

export interface Cliente {
  id: number;
  dni: string;
  nombre: string;
  email: string;
  direccion: string;
  telefonos?: Telefono[];
}