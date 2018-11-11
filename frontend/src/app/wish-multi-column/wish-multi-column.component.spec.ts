import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishMultiColumnComponent } from './wish-multi-column.component';

describe('WishMultiColumnComponent', () => {
  let component: WishMultiColumnComponent;
  let fixture: ComponentFixture<WishMultiColumnComponent>;

  beforeEach(async(() => {
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
