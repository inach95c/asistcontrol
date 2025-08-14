import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresUserComponent } from './indicadores-user.component';

describe('IndicadoresUserComponent', () => {
  let component: IndicadoresUserComponent;
  let fixture: ComponentFixture<IndicadoresUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadoresUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadoresUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
