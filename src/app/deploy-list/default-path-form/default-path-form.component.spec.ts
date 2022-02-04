import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPathFormComponent } from './default-path-form.component';

describe('DefaultPathFormComponent', () => {
  let component: DefaultPathFormComponent;
  let fixture: ComponentFixture<DefaultPathFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultPathFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPathFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
