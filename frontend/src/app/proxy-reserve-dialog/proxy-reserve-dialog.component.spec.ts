import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyReserveDialogComponent } from './proxy-reserve-dialog.component';

describe('ReserveDialogComponent', () => {
  let component: ProxyReserveDialogComponent;
  let fixture: ComponentFixture<ProxyReserveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyReserveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyReserveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
