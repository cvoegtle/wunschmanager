import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishViewMultiColumnComponent } from './wish-view-multi-column.component';

describe('WishViewMultiColumnComponent', () => {
  let component: WishViewMultiColumnComponent;
  let fixture: ComponentFixture<WishViewMultiColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishViewMultiColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishViewMultiColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
