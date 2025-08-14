import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Historial1Component } from './historial1.component';

describe('Historial1Component', () => {
  let component: Historial1Component;
  let fixture: ComponentFixture<Historial1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Historial1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Historial1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
