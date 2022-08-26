import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditComponent } from './content-edit.component';

describe('LinkEditComponent', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
