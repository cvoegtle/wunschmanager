import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishPropertiesComponent } from './wish-properties.component';

describe('WishPropertiesComponent', () => {
  let component: WishPropertiesComponent;
  let fixture: ComponentFixture<WishPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
