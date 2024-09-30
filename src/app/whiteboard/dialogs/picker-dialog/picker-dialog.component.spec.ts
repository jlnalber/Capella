import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerDialogComponent } from './picker-dialog.component';

describe('PickerDialogComponent', () => {
  let component: PickerDialogComponent;
  let fixture: ComponentFixture<PickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
