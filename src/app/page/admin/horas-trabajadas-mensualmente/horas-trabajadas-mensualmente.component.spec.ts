import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasTrabajadasMensualmenteComponent } from './horas-trabajadas-mensualmente.component';

describe('HorasTrabajadasMensualmenteComponent', () => {
  let component: HorasTrabajadasMensualmenteComponent;
  let fixture: ComponentFixture<HorasTrabajadasMensualmenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorasTrabajadasMensualmenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorasTrabajadasMensualmenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
