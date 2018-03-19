import { TestBed, inject } from '@angular/core/testing';

import { ServiceDetailService } from './service-detail.service';

describe('ServiceDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceDetailService]
    });
  });

  it('should be created', inject([ServiceDetailService], (service: ServiceDetailService) => {
    expect(service).toBeTruthy();
  }));
});
