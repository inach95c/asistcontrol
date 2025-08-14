import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadExamenComponent } from './load-examen.component';

describe('LoadExamenComponent', () => {
  let component: LoadExamenComponent;
  let fixture: ComponentFixture<LoadExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
