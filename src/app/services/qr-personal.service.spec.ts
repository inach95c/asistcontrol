import { TestBed } from '@angular/core/testing';

import { QrPersonalService } from './qr-personal.service';

describe('QrPersonalService', () => {
  let service: QrPersonalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrPersonalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
