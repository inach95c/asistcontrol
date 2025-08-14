import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasAsisteciaComponent } from './estadisticas-asistecia.component';

describe('EstadisticasAsisteciaComponent', () => {
  let component: EstadisticasAsisteciaComponent;
  let fixture: ComponentFixture<EstadisticasAsisteciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticasAsisteciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasAsisteciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
