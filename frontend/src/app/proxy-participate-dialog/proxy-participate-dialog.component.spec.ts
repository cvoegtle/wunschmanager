import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyParticipateDialogComponent } from './proxy-participate-dialog.component';

describe('ParticipateDialogComponent', () => {
  let component: ProxyParticipateDialogComponent;
  let fixture: ComponentFixture<ProxyParticipateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProxyParticipateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxyParticipateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
