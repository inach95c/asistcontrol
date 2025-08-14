import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAsistenciaComponent } from './login-asistencia.component';

describe('LoginAsistenciaComponent', () => {
  let component: LoginAsistenciaComponent;
  let fixture: ComponentFixture<LoginAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
