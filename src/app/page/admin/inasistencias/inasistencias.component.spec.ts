import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InasistenciasComponent } from './inasistencias.component';

describe('InasistenciasComponent', () => {
  let component: InasistenciasComponent;
  let fixture: ComponentFixture<InasistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InasistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InasistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
