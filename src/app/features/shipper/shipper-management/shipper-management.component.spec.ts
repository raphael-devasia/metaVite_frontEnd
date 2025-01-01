import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperManagementComponent } from './shipper-management.component';

describe('ShipperManagementComponent', () => {
  let component: ShipperManagementComponent;
  let fixture: ComponentFixture<ShipperManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipperManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipperManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
