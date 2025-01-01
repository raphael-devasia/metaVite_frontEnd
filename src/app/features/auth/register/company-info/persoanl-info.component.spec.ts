import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoanlInfoComponent } from './persoanl-info.component';

describe('PersoanlInfoComponent', () => {
  let component: PersoanlInfoComponent;
  let fixture: ComponentFixture<PersoanlInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersoanlInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersoanlInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
