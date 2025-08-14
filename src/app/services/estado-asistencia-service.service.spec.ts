import { TestBed } from '@angular/core/testing';

import { EstadoAsistenciaServiceService } from './estado-asistencia-service.service';

describe('EstadoAsistenciaServiceService', () => {
  let service: EstadoAsistenciaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadoAsistenciaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
