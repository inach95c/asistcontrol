import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaAdminComponent } from './asistencia-admin.component';

describe('AsistenciaAdminComponent', () => {
  let component: AsistenciaAdminComponent;
  let fixture: ComponentFixture<AsistenciaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
