import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonTextComponent } from './ribbon-text.component';

describe('RibbonTextComponent', () => {
  let component: RibbonTextComponent;
  let fixture: ComponentFixture<RibbonTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RibbonTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RibbonTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
