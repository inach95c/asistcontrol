import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialUserComponent } from './historial-user.component';

describe('HistorialUserComponent', () => {
  let component: HistorialUserComponent;
  let fixture: ComponentFixture<HistorialUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
