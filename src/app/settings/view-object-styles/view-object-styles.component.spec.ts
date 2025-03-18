import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewObjectStylesComponent } from './view-object-styles.component';

describe('ViewObjectStylesComponent', () => {
  let component: ViewObjectStylesComponent;
  let fixture: ComponentFixture<ViewObjectStylesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewObjectStylesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewObjectStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
