import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskAsistenciaComponent } from './kiosk-asistencia.component';

describe('KioskAsistenciaComponent', () => {
  let component: KioskAsistenciaComponent;
  let fixture: ComponentFixture<KioskAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
