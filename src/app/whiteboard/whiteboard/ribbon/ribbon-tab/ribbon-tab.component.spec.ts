import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonTabComponent } from './ribbon-tab.component';

describe('RibbonTabComponent', () => {
  let component: RibbonTabComponent;
  let fixture: ComponentFixture<RibbonTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RibbonTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RibbonTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
