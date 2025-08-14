import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHorarioComponent } from './asignar-horarios.component';

describe('AsignarHorarioComponent', () => {
  let component: AsignarHorarioComponent;
  let fixture: ComponentFixture<AsignarHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
