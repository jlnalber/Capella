import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectStyleComponent } from './object-style.component';

describe('ObjectStyleComponent', () => {
  let component: ObjectStyleComponent;
  let fixture: ComponentFixture<ObjectStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
