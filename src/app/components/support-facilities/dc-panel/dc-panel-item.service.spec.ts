import { TestBed } from '@angular/core/testing';

import { DcPanelItemService } from './dc-panel-item.service';

describe('DcPanelItemService', () => {
  let service: DcPanelItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DcPanelItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
