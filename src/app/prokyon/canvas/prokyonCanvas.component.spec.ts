import { ProkyonCanvasComponent } from './prokyonCanvas.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('CanvasComponent', () => {
  let component: ProkyonCanvasComponent;
  let fixture: ComponentFixture<ProkyonCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProkyonCanvasComponent]
    });
    fixture = TestBed.createComponent(ProkyonCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
