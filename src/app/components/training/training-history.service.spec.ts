import { TestBed } from '@angular/core/testing';

import { TrainingHistoryService } from './training-history.service';

describe('TrainingHistoryService', () => {
  let service: TrainingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
