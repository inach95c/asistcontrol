import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSalarioPersonalComponent } from './resumen-salario-personal.component';

describe('ResumenSalarioPersonalComponent', () => {
  let component: ResumenSalarioPersonalComponent;
  let fixture: ComponentFixture<ResumenSalarioPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenSalarioPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenSalarioPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
