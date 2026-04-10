import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorEditorComponent } from './donor-editor.component';

describe('DonorViewerComponent', () => {
  let component: DonorEditorComponent;
  let fixture: ComponentFixture<DonorEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
