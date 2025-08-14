import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioPersonalComponent } from './horario-personal.component';

describe('HorarioPersonalComponent', () => {
  let component: HorarioPersonalComponent;
  let fixture: ComponentFixture<HorarioPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorarioPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
