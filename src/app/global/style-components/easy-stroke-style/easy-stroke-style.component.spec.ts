import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyStrokeStyleComponent } from './easy-stroke-style.component';

describe('EasyStrokeStyleComponent', () => {
  let component: EasyStrokeStyleComponent;
  let fixture: ComponentFixture<EasyStrokeStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyStrokeStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EasyStrokeStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
