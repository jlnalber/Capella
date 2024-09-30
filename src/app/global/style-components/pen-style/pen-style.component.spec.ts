import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenStyleComponent } from './pen-style.component';

describe('PenStyleComponent', () => {
  let component: PenStyleComponent;
  let fixture: ComponentFixture<PenStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
