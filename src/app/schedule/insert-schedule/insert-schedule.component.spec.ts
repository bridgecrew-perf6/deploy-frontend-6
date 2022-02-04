import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertScheduleComponent } from './insert-schedule.component';

describe('InsertScheduleComponent', () => {
  let component: InsertScheduleComponent;
  let fixture: ComponentFixture<InsertScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
