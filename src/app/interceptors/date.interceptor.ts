import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
/*export class DateInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Si el cuerpo de la solicitud contiene una fecha, la transformamos
        if (req.body && req.body.fechaDeSolicitud) {
            const fechaFormateada = new Date(req.body.fechaDeSolicitud).toISOString().split('T')[0]; // Formato yyyy-MM-dd
            const modificado = req.clone({
                body: { ...req.body, fechaDeSolicitud: fechaFormateada }
            });
            return next.handle(modificado); // Enviamos la solicitud modificada
        }

        return next.handle(req); // Si no hay fecha, enviamos la solicitud sin cambios
    }
}*/

export class DateInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Verificamos si el cuerpo de la solicitud contiene las fechas
        const body = req.body;
        if (body) {
            const fechaModificada = { ...body };

            if (body.fechaDeSolicitud) {
                fechaModificada.fechaDeSolicitud = new Date(body.fechaDeSolicitud).toISOString().split('T')[0]; // Formato yyyy-MM-dd
            }

            if (body.fechaRespuestaCalificacionOperaciones) {
                fechaModificada.fechaRespuestaCalificacionOperaciones = new Date(body.fechaRespuestaCalificacionOperaciones).toISOString().split('T')[0]; // Formato yyyy-MM-dd
            }

            if (body.fechaDeEjecucionEstimadaAProponer) {
                fechaModificada.fechaDeEjecucionEstimadaAProponer = new Date(body.fechaDeEjecucionEstimadaAProponer).toISOString().split('T')[0]; // Formato yyyy-MM-dd
            }
          

            const modificado = req.clone({
                body: fechaModificada
            });

            return next.handle(modificado); // Enviamos la solicitud modificada
        }

        return next.handle(req); // Si no hay datos en el cuerpo, enviamos la solicitud sin cambios
    }
}

