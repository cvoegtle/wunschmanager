import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListActionsDialogComponent } from './wish-list-actions-dialog.component';

describe('WishListActionsDialogComponent', () => {
  let component: WishListActionsDialogComponent;
  let fixture: ComponentFixture<WishListActionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishListActionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListActionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
