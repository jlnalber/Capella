import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialGradientStyleComponent } from './radial-gradient-style.component';

describe('RadialGradientStyleComponent', () => {
  let component: RadialGradientStyleComponent;
  let fixture: ComponentFixture<RadialGradientStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadialGradientStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadialGradientStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
