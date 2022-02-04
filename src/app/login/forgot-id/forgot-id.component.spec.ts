import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotIdComponent } from './forgot-id.component';

describe('ForgotIdComponent', () => {
  let component: ForgotIdComponent;
  let fixture: ComponentFixture<ForgotIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
