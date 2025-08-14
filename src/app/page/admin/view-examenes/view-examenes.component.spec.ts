import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExamenesComponent } from './view-examenes.component';

describe('ViewExamenesComponent', () => {
  let component: ViewExamenesComponent;
  let fixture: ComponentFixture<ViewExamenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExamenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExamenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
