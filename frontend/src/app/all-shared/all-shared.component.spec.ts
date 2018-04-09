import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSharedComponent } from './all-shared.component';

describe('AllSharedComponent', () => {
  let component: AllSharedComponent;
  let fixture: ComponentFixture<AllSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
