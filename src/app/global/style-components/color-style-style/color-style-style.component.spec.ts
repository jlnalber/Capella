import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorStyleStyleComponent } from './color-style-style.component';

describe('ColorStyleStyleComponent', () => {
  let component: ColorStyleStyleComponent;
  let fixture: ComponentFixture<ColorStyleStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorStyleStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColorStyleStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
