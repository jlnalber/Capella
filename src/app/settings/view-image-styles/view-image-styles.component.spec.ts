import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageStylesComponent } from './view-image-styles.component';

describe('ViewImageStylesComponent', () => {
  let component: ViewImageStylesComponent;
  let fixture: ComponentFixture<ViewImageStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewImageStylesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewImageStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
