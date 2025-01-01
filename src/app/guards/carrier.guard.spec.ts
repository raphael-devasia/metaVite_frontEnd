import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { carrierGuard } from './carrier.guard';

describe('carrierGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => carrierGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
