import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenStyleStyleComponent } from './pen-style-style.component';

describe('PenStyleStyleComponent', () => {
  let component: PenStyleStyleComponent;
  let fixture: ComponentFixture<PenStyleStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenStyleStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PenStyleStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
