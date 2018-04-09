import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListEditComponent } from './wish-list-edit.component';

describe('WishListEditComponent', () => {
  let component: WishListEditComponent;
  let fixture: ComponentFixture<WishListEditComponent>;

  beforeEach(async(() => {
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
