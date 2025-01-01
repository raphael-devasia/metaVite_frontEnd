import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierLayoutComponent } from './carrier-layout.component';

describe('CarrierLayoutComponent', () => {
  let component: CarrierLayoutComponent;
  let fixture: ComponentFixture<CarrierLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrierLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrierLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
