import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishListEditComponent } from './wish-list-edit.component';

describe('WishListEditComponent', () => {
  let component: WishListEditComponent;
  let fixture: ComponentFixture<WishListEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
