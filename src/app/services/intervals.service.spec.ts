import { TestBed } from '@angular/core/testing';

import { IntervalsService } from './intervals.service';

describe('IntervalsService', () => {
  let service: IntervalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
