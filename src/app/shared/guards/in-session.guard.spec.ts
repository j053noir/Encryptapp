import { TestBed, async, inject } from '@angular/core/testing';

import { InSessionGuard } from './in-session.guard';

describe('InSessionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InSessionGuard]
    });
  });

  it('should ...', inject([InSessionGuard], (guard: InSessionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
