import { TestBed } from '@angular/core/testing';

import { RectifierService } from './rectifier.service';

describe('RectifierService', () => {
  let service: RectifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
