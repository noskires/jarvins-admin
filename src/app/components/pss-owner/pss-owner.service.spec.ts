import { TestBed } from '@angular/core/testing';

import { PssOwnerService } from './pss-owner.service';

describe('PssOwnerService', () => {
  let service: PssOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PssOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
