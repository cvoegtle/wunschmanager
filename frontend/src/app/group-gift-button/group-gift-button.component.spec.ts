import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupGiftButtonComponent } from './group-gift-button.component';

describe('GroupGiftButtonComponent', () => {
  let component: GroupGiftButtonComponent;
  let fixture: ComponentFixture<GroupGiftButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupGiftButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupGiftButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
