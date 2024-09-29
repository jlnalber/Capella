import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSettingsDialogComponent } from './view-settings-dialog.component';

describe('ViewSettingsDialogComponent', () => {
  let component: ViewSettingsDialogComponent;
  let fixture: ComponentFixture<ViewSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSettingsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
