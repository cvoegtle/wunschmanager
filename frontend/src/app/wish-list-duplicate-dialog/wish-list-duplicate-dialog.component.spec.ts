import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishListDuplicateDialogComponent } from './wish-list-duplicate-dialog.component';

describe('WishListDuplicateDialogComponent', () => {
  let component: WishListDuplicateDialogComponent;
  let fixture: ComponentFixture<WishListDuplicateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListDuplicateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListDuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
