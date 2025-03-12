import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePenComponent } from './choose-pen.component';

describe('ChoosePenStyleComponent', () => {
  let component: ChoosePenComponent;
  let fixture: ComponentFixture<ChoosePenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoosePenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
