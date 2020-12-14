import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishListViewComponent } from './wish-list-view.component';

describe('WishListViewComponent', () => {
  let component: WishListViewComponent;
  let fixture: ComponentFixture<WishListViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
