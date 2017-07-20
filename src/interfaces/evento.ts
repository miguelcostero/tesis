import { EventoIn } from './EventoIn'
import { TipoEvento } from './tipo_evento'
import { Empleado } from './empleado'
import { Locacion } from './locacion'
import { Cliente } from './cliente'
import { EstadoEvento } from './estado_evento'
import { Talento } from './talento'

export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_agregado: string;
  icono: string;
  invitados: number;
  talentos?: Talento[];
  cronograma: Array<EventoIn>;
  tipo_evento: TipoEvento;
  empleado: Empleado;
  locacion: Locacion;
  cliente: Cliente;
  estado_evento: EstadoEvento;
}