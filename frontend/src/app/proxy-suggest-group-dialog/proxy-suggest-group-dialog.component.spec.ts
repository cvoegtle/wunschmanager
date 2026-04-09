import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxySuggestGroupDialogComponent } from './proxy-suggest-group-dialog.component';

describe('ReserveDialogComponent', () => {
  let component: ProxySuggestGroupDialogComponent;
  let fixture: ComponentFixture<ProxySuggestGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxySuggestGroupDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxySuggestGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
