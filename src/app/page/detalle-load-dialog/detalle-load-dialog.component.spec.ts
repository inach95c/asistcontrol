import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleLoadDialogComponent } from './detalle-load-dialog.component';

describe('DetalleLoadDialogComponent', () => {
  let component: DetalleLoadDialogComponent;
  let fixture: ComponentFixture<DetalleLoadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleLoadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleLoadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
