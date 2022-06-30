import { TestBed } from '@angular/core/testing';

import { ElectricCompanyService } from './electric-company.service';

describe('ElectricCompanyService', () => {
  let service: ElectricCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectricCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
