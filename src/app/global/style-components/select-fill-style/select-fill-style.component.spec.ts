import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFillStyleComponent } from './select-fill-style.component';

describe('SelectFillStyleComponent', () => {
  let component: SelectFillStyleComponent;
  let fixture: ComponentFixture<SelectFillStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFillStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFillStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
