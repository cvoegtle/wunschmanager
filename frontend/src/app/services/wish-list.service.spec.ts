import { TestBed, inject } from '@angular/core/testing';

import { WishListService } from './wish-list.service';

describe('WishListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WishListService]
    });
  });

  it('should be created', inject([WishListService], (service: WishListService) => {
    expect(service).toBeTruthy();
  }));
});
