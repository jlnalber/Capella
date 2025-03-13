import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectStyleWrapperComponent } from './object-style-wrapper.component';

describe('ObjectStyleWrapperComponent', () => {
  let component: ObjectStyleWrapperComponent;
  let fixture: ComponentFixture<ObjectStyleWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectStyleWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectStyleWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
