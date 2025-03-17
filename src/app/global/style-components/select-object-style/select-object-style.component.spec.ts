import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectObjectStyleComponent } from './select-object-style.component';

describe('SelectObjectStyleComponent', () => {
  let component: SelectObjectStyleComponent;
  let fixture: ComponentFixture<SelectObjectStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectObjectStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectObjectStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
