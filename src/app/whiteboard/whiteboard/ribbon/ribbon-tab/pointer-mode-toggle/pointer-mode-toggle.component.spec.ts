import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointerModeToggleComponent } from './pointer-mode-toggle.component';

describe('PointerModeToggleComponent', () => {
  let component: PointerModeToggleComponent;
  let fixture: ComponentFixture<PointerModeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointerModeToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointerModeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
