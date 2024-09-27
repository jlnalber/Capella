import { TestBed } from '@angular/core/testing';

import { WhiteboardSettingsService } from './whiteboard-settings.service';

describe('WhiteboardSettingsService', () => {
  let service: WhiteboardSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhiteboardSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
