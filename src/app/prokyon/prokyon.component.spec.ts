import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProkyonComponent } from './prokyon.component';

describe('ProkyonComponent', () => {
  let component: ProkyonComponent;
  let fixture: ComponentFixture<ProkyonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProkyonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProkyonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
