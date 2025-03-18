import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStrokeStylesComponent } from './view-stroke-styles.component';

describe('ViewStrokeStylesComponent', () => {
  let component: ViewStrokeStylesComponent;
  let fixture: ComponentFixture<ViewStrokeStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStrokeStylesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewStrokeStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
