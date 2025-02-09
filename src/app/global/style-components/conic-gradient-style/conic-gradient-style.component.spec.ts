import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConicGradientStyleComponent } from './conic-gradient-style.component';

describe('ConicGradientStyleComponent', () => {
  let component: ConicGradientStyleComponent;
  let fixture: ComponentFixture<ConicGradientStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConicGradientStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConicGradientStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
