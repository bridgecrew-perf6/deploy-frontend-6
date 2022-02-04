import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploySummaryComponent } from './deploy-summary.component';

describe('DeploySummaryComponent', () => {
  let component: DeploySummaryComponent;
  let fixture: ComponentFixture<DeploySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
