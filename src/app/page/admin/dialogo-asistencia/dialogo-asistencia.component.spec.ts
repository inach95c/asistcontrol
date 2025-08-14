import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAsistenciaComponent } from './dialogo-asistencia.component';

describe('DialogoAsistenciaComponent', () => {
  let component: DialogoAsistenciaComponent;
  let fixture: ComponentFixture<DialogoAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
