import { Telefono } from './telefono'

export interface Locacion {
  id: number;
  nombre: string;
  direccion: string;
  capacidad: number;
  telefonos?: Telefono[];
}