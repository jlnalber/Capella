import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPensComponent } from './view-pens.component';

describe('ViewPensComponent', () => {
  let component: ViewPensComponent;
  let fixture: ComponentFixture<ViewPensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
