import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishViewComponent } from './wish-view.component';

describe('WishViewComponent', () => {
  let component: WishViewComponent;
  let fixture: ComponentFixture<WishViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
