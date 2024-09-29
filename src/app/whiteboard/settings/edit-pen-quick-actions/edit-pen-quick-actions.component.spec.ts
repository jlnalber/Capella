import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPenQuickActionsComponent } from './edit-pen-quick-actions.component';

describe('EditPenQuickActionsComponent', () => {
  let component: EditPenQuickActionsComponent;
  let fixture: ComponentFixture<EditPenQuickActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPenQuickActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPenQuickActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
