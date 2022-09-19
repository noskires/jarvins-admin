import { TestBed } from '@angular/core/testing';

import { AcPanelService } from './ac-panel.service';

describe('AcPanelService', () => {
  let service: AcPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
