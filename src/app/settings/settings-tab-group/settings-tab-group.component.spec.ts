import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTabGroupComponent } from './settings-tab-group.component';

describe('SettingsTabGroupComponent', () => {
  let component: SettingsTabGroupComponent;
  let fixture: ComponentFixture<SettingsTabGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTabGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingsTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
