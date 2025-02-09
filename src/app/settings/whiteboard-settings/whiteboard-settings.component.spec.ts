import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteboardSettingsComponent } from './whiteboard-settings.component';

describe('WhiteboardSettingsComponent', () => {
  let component: WhiteboardSettingsComponent;
  let fixture: ComponentFixture<WhiteboardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteboardSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhiteboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
