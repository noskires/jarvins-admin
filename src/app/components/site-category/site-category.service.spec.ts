import { TestBed } from '@angular/core/testing';

import { SiteCategoryService } from './site-category.service';

describe('SiteCategoryService', () => {
  let service: SiteCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
