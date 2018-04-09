import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListViewComponent } from './wish-list-view.component';

describe('WishListViewComponent', () => {
  let component: WishListViewComponent;
  let fixture: ComponentFixture<WishListViewComponent>;

  beforeEach(async(() => {
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
