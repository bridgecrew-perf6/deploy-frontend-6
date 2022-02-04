import { TestBed } from '@angular/core/testing';

import { DefaultPathService } from './default-path.service';

describe('DefaultPathService', () => {
  let service: DefaultPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
