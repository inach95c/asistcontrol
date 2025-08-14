import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPersonalComponent } from './qr-personal.component';

describe('QrPersonalComponent', () => {
  let component: QrPersonalComponent;
  let fixture: ComponentFixture<QrPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
