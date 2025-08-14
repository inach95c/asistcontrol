import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsistenciaDiariaComponent } from './registro-asistencia-diaria.component';

describe('RegistroAsistenciaDiariaComponent', () => {
  let component: RegistroAsistenciaDiariaComponent;
  let fixture: ComponentFixture<RegistroAsistenciaDiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroAsistenciaDiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAsistenciaDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
