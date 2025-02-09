import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternStyleComponent } from './pattern-style.component';

describe('PatternStyleComponent', () => {
  let component: PatternStyleComponent;
  let fixture: ComponentFixture<PatternStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatternStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
