import { TestBed } from '@angular/core/testing';

import { RectifierItemService } from './rectifier-item.service';

describe('RectifierItemService', () => {
  let service: RectifierItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectifierItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
