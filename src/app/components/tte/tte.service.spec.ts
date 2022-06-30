import { TestBed } from '@angular/core/testing';

import { TteService } from './tte.service';

describe('TteService', () => {
  let service: TteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
