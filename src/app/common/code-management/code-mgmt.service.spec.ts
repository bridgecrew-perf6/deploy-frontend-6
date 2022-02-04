import { TestBed } from '@angular/core/testing';

import { CodeMgmtService } from './code-mgmt.service';

describe('CodeMgmtService', () => {
  let service: CodeMgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeMgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
