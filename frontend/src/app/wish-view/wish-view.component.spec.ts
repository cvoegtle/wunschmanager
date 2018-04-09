import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishViewComponent } from './wish-view.component';

describe('WishViewComponent', () => {
  let component: WishViewComponent;
  let fixture: ComponentFixture<WishViewComponent>;

  beforeEach(async(() => {
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
