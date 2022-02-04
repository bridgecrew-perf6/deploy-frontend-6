import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPathListComponent } from './default-path-list.component';

describe('DefaultPathListComponent', () => {
  let component: DefaultPathListComponent;
  let fixture: ComponentFixture<DefaultPathListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultPathListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPathListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
