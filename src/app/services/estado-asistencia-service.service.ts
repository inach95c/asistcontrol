import { Injectable } from '@angular/core';
import { Horario } from '../models/horario';
import { Asistencia } from './asistencia.service';
import { EstadoTurno } from '../models/estado-turno';


@Injectable({ providedIn: 'root' })
export class EstadoAsistenciaService {
  calcularEstadoTurno(turno: Horario, historial: Asistencia[]): EstadoTurno {
    const ahora = new Date();
    const hoy = ahora.toDateString();

    const [hEntrada, mEntrada] = turno.horaEntrada.split(':').map(Number);
    const [hSalida, mSalida] = turno.horaSalida.split(':').map(Number);

    const inicio = new Date();
    inicio.setHours(hEntrada, mEntrada, 0, 0);

    const fin = new Date();
    fin.setHours(hSalida, mSalida, 0, 0);

    const entradas = historial.filter(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'ENTRADA'
    );
    const salidas = historial.filter(a =>
      new Date(a.fechaHora).toDateString() === hoy && a.tipo === 'SALIDA'
    );

    const entradaRegistrada = entradas.some(e => {
      const hora = new Date(e.fechaHora);
      return hora >= inicio && hora <= fin;
    });

    const salidaRegistrada = salidas.some(s => {
      const hora = new Date(s.fechaHora);
      return hora >= inicio && hora <= fin;
    });

    // ✅ Turno completado
    if (entradaRegistrada && salidaRegistrada) {
      return { emoji: '✔️', texto: 'Completado' };
    }

    // ⏳ Entrada registrada pero falta salida
    if (entradaRegistrada && !salidaRegistrada) {
      if (ahora > fin) {
        return { emoji: '⚠️', texto: 'Turno vencido, falta salida' };
      } else {
        return { emoji: '⏳', texto: 'Falta salida' };
      }
    }

    // 🕒 No hay registros aún
    if (!entradaRegistrada && !salidaRegistrada) {
      if (ahora >= inicio && ahora <= fin) {
        return { emoji: '🕒', texto: 'Pendiente' };
      } else {
        return { emoji: '❌', texto: 'No registrado' };
      }
    }

    // ⚠️ Casos anómalos
    return { emoji: '⚠️', texto: 'Incompleto' };
  }
}
