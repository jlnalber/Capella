import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPenColorStyleComponent } from './easy-pen-color-style.component';

describe('EasyPenColorStyleComponent', () => {
  let component: EasyPenColorStyleComponent;
  let fixture: ComponentFixture<EasyPenColorStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyPenColorStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EasyPenColorStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
