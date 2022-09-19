import { TestBed } from '@angular/core/testing';

import { DcPanelService } from './dc-panel.service';

describe('DcPanelService', () => {
  let service: DcPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DcPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
