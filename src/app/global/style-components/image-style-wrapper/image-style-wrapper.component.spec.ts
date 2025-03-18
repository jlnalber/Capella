import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStyleWrapperComponent } from './image-style-wrapper.component';

describe('ImageStyleWrapperComponent', () => {
  let component: ImageStyleWrapperComponent;
  let fixture: ComponentFixture<ImageStyleWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageStyleWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageStyleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
