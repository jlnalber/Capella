import { TestBed } from '@angular/core/testing';

import { ProkyonSettingsService } from './prokyon-settings.service';

describe('ProkyonSettingsServiceService', () => {
  let service: ProkyonSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProkyonSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
