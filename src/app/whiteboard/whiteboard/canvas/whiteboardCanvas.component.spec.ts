import { WhiteboardCanvasComponent } from './whiteboardCanvas.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CanvasComponent', () => {
  let component: WhiteboardCanvasComponent;
  let fixture: ComponentFixture<WhiteboardCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhiteboardCanvasComponent]
    });
    fixture = TestBed.createComponent(WhiteboardCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
