import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { shipperGuard } from './shipper.guard';

describe('shipperGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => shipperGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
