import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSalarioMensualComponent } from './resumen-salario-mensual.component';

describe('ResumenSalarioMensualComponent', () => {
  let component: ResumenSalarioMensualComponent;
  let fixture: ComponentFixture<ResumenSalarioMensualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenSalarioMensualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenSalarioMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
