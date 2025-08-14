import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorcentajePorUsuarioComponent } from './porcentaje-por-usuario.component';

describe('PorcentajePorUsuarioComponent', () => {
  let component: PorcentajePorUsuarioComponent;
  let fixture: ComponentFixture<PorcentajePorUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorcentajePorUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorcentajePorUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
