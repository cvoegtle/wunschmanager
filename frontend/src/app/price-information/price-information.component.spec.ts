import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceInformationComponent } from './price-information.component';

describe('PriceInformationComponent', () => {
  let component: PriceInformationComponent;
  let fixture: ComponentFixture<PriceInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
