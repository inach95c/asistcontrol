import { TestBed } from '@angular/core/testing';

import { AsistenciaStateService } from './asistencia-state.service';

describe('AsistenciaStateService', () => {
  let service: AsistenciaStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciaStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
