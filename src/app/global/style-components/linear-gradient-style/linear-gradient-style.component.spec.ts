import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearGradientStyleComponent } from './linear-gradient-style.component';

describe('LinearGradientStyleComponent', () => {
  let component: LinearGradientStyleComponent;
  let fixture: ComponentFixture<LinearGradientStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearGradientStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinearGradientStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
