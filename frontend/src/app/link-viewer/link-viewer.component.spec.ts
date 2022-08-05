import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkViewerComponent } from './link-viewer.component';

describe('LinkViewerComponent', () => {
  let component: LinkViewerComponent;
  let fixture: ComponentFixture<LinkViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
