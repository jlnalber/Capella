import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorStyleComponent } from './color-style.component';

describe('ColorPickerComponent', () => {
  let component: ColorStyleComponent;
  let fixture: ComponentFixture<ColorStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
