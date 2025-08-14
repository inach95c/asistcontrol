import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenHorariosComponent } from './resumen-horarios.component';

describe('ResumenHorariosComponent', () => {
  let component: ResumenHorariosComponent;
  let fixture: ComponentFixture<ResumenHorariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenHorariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
