import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleExamenDialogComponent } from './detalle-examen-dialog.component';

describe('DetalleExamenDialogComponent', () => {
  let component: DetalleExamenDialogComponent;
  let fixture: ComponentFixture<DetalleExamenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleExamenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleExamenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
