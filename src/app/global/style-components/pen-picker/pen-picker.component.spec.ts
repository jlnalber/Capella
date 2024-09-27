import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenPickerComponent } from './pen-picker.component';

describe('PenPickerComponent', () => {
  let component: PenPickerComponent;
  let fixture: ComponentFixture<PenPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
