import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalStrokeStyleComponent } from './universal-stroke-style.component';

describe('UniversalStrokeStyleComponent', () => {
  let component: UniversalStrokeStyleComponent;
  let fixture: ComponentFixture<UniversalStrokeStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversalStrokeStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniversalStrokeStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
