import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadManagementComponent } from './load-management.component';

describe('LoadManagementComponent', () => {
  let component: LoadManagementComponent;
  let fixture: ComponentFixture<LoadManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
