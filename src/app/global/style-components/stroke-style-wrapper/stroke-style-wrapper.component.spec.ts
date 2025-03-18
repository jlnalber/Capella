import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeStyleWrapperComponent } from './stroke-style-wrapper.component';

describe('StrokeStyleWrapperComponent', () => {
  let component: StrokeStyleWrapperComponent;
  let fixture: ComponentFixture<StrokeStyleWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrokeStyleWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StrokeStyleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
