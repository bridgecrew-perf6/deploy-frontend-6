import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertUpdateCodeComponent } from './insert-update-code.component';

describe('InsertUpdateCodeComponent', () => {
  let component: InsertUpdateCodeComponent;
  let fixture: ComponentFixture<InsertUpdateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertUpdateCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertUpdateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
