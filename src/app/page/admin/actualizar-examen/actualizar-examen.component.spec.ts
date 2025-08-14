import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarExamenComponent } from './actualizar-examen.component';

describe('ActualizarExamenComponent', () => {
  let component: ActualizarExamenComponent;
  let fixture: ComponentFixture<ActualizarExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
