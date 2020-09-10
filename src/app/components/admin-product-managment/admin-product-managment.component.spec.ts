import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductManagmentComponent } from './admin-product-managment.component';

describe('AdminProductManagmentComponent', () => {
  let component: AdminProductManagmentComponent;
  let fixture: ComponentFixture<AdminProductManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
