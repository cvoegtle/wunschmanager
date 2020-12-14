import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishMultiColumnComponent } from './wish-multi-column.component';

describe('WishViewMultiColumnComponent', () => {
  let component: WishMultiColumnComponent;
  let fixture: ComponentFixture<WishMultiColumnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishMultiColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishMultiColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
