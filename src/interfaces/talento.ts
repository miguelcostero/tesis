import { Telefono } from './telefono'

export interface Talento {
  id?: number;
  nombre: string;
  email: string;
  notas: string;
  telefonos?: Telefono[];
}