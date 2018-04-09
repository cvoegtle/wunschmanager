import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHandler } from './error-handler.component';

describe('ErrorHandler', () => {
  let component: ErrorHandler;
  let fixture: ComponentFixture<ErrorHandler>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorHandler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
