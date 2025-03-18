import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillStyleWrapperComponent } from './fill-style-wrapper.component';

describe('FillStyleWrapperComponent', () => {
  let component: FillStyleWrapperComponent;
  let fixture: ComponentFixture<FillStyleWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillStyleWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FillStyleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
