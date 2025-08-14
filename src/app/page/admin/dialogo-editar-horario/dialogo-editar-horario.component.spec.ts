import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEditarHorarioComponent } from './dialogo-editar-horario.component';

describe('DialogoEditarHorarioComponent', () => {
  let component: DialogoEditarHorarioComponent;
  let fixture: ComponentFixture<DialogoEditarHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoEditarHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoEditarHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
