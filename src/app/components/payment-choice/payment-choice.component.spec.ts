import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentChoiceComponent } from './payment-choice.component';

describe('PaymentChoiceComponent', () => {
  let component: PaymentChoiceComponent;
  let fixture: ComponentFixture<PaymentChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
