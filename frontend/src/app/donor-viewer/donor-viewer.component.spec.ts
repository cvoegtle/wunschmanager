import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorViewerComponent } from './donor-viewer.component';

describe('DonorViewerComponent', () => {
  let component: DonorViewerComponent;
  let fixture: ComponentFixture<DonorViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
