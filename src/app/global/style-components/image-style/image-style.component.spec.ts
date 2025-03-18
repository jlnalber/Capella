import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStyleComponent } from './image-style.component';

describe('ImageStyleComponent', () => {
  let component: ImageStyleComponent;
  let fixture: ComponentFixture<ImageStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
