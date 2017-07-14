import { Role } from './role'
import { Telefono } from './telefono'

export interface Empleado {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento?: string;
  img_perfil?: string;
  role?: Role;
  token?: string;
  telefonos?: Telefono[];
}