import { TestBed } from '@angular/core/testing';

import { BidpriceSocketService } from './bidprice-socket.service';

describe('BidpriceSocketService', () => {
  let service: BidpriceSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidpriceSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
