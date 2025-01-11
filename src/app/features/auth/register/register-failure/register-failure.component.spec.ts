import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFailureComponent } from './register-failure.component';

describe('RegisterFailureComponent', () => {
  let component: RegisterFailureComponent;
  let fixture: ComponentFixture<RegisterFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFailureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
