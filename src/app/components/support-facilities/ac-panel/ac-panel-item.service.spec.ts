import { TestBed } from '@angular/core/testing';

import { AcPanelItemService } from './ac-panel-item.service';

describe('AcPanelItemService', () => {
  let service: AcPanelItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcPanelItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
