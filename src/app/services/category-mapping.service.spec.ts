import { TestBed } from '@angular/core/testing';

import { CategoryMappingService } from './category-mapping.service';

describe('CategoryMappingService', () => {
  let service: CategoryMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
