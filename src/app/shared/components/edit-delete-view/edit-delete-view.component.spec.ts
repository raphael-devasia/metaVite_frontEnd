import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteViewComponent } from './edit-delete-view.component';

describe('EditDeleteViewComponent', () => {
  let component: EditDeleteViewComponent;
  let fixture: ComponentFixture<EditDeleteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeleteViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeleteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
