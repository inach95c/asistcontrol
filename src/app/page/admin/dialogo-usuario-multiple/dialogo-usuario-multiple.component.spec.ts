import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoUsuarioMultipleComponent } from './dialogo-usuario-multiple.component';

describe('DialogoUsuarioMultipleComponent', () => {
  let component: DialogoUsuarioMultipleComponent;
  let fixture: ComponentFixture<DialogoUsuarioMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoUsuarioMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoUsuarioMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
