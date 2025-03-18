import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFillStylesComponent } from './view-fill-styles.component';

describe('ViewFillStylesComponent', () => {
  let component: ViewFillStylesComponent;
  let fixture: ComponentFixture<ViewFillStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFillStylesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFillStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
