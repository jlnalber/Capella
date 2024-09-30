import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyPenStyleStyleComponent } from './easy-pen-style-style.component';

describe('EasyPenStyleStyleComponent', () => {
  let component: EasyPenStyleStyleComponent;
  let fixture: ComponentFixture<EasyPenStyleStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasyPenStyleStyleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EasyPenStyleStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
