import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishEditPopupComponent } from './wish-edit-popup.component';

describe('WishEditPopupComponent', () => {
  let component: WishEditPopupComponent;
  let fixture: ComponentFixture<WishEditPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishEditPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
