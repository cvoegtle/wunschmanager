import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestGroupDialogComponent } from './suggest-group-dialog.component';

describe('SuggestGroupDialogComponent', () => {
  let component: SuggestGroupDialogComponent;
  let fixture: ComponentFixture<SuggestGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestGroupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
