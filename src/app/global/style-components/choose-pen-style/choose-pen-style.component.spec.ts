import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePenStyleComponent } from './choose-pen-style.component';

describe('ChoosePenStyleComponent', () => {
  let component: ChoosePenStyleComponent;
  let fixture: ComponentFixture<ChoosePenStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePenStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoosePenStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
