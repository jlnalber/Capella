import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStrokeStyleComponent } from './select-stroke-style.component';

describe('SelectStrokeStyleComponent', () => {
  let component: SelectStrokeStyleComponent;
  let fixture: ComponentFixture<SelectStrokeStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectStrokeStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectStrokeStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
