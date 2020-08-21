import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurentOrdersComponent } from './restaurent-orders.component';

describe('RestaurentOrdersComponent', () => {
  let component: RestaurentOrdersComponent;
  let fixture: ComponentFixture<RestaurentOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurentOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurentOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
