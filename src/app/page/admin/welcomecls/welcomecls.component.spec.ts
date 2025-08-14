import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeclsComponent } from './welcomecls.component';

describe('WelcomeclsComponent', () => {
  let component: WelcomeclsComponent;
  let fixture: ComponentFixture<WelcomeclsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeclsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeclsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
