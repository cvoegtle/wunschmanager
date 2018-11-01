import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectToggleComponent } from './select-toggle.component';

describe('SelectToggleComponent', () => {
  let component: SelectToggleComponent;
  let fixture: ComponentFixture<SelectToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
