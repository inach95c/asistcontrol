import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesUserComponent } from './reportes-user.component';

describe('ReportesUserComponent', () => {
  let component: ReportesUserComponent;
  let fixture: ComponentFixture<ReportesUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportesUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
