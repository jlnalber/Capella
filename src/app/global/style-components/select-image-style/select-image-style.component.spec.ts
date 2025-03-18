import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectImageStyleComponent } from './select-image-style.component';

describe('SelectImageStyleComponent', () => {
  let component: SelectImageStyleComponent;
  let fixture: ComponentFixture<SelectImageStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectImageStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectImageStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
