import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployStateChangeComponent } from './deploy-state-change.component';

describe('DeployStateChangeComponent', () => {
  let component: DeployStateChangeComponent;
  let fixture: ComponentFixture<DeployStateChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployStateChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployStateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
