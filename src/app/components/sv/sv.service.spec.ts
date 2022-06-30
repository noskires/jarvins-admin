import { TestBed } from '@angular/core/testing';

import { SvService } from './sv.service';

describe('SvService', () => {
  let service: SvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
