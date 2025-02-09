import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientStopsComponent } from './gradient-stops.component';

describe('GradientStopsComponent', () => {
  let component: GradientStopsComponent;
  let fixture: ComponentFixture<GradientStopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradientStopsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradientStopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
