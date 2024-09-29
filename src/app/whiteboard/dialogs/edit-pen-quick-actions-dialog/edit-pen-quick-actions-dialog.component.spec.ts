import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPenQuickActionsDialogComponent } from './edit-pen-quick-actions-dialog.component';

describe('EditPenQuickActionsDialogComponent', () => {
  let component: EditPenQuickActionsDialogComponent;
  let fixture: ComponentFixture<EditPenQuickActionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPenQuickActionsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPenQuickActionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
