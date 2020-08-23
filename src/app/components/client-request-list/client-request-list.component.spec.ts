import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRequestListComponent } from './client-request-list.component';

describe('ClientRequestListComponent', () => {
  let component: ClientRequestListComponent;
  let fixture: ComponentFixture<ClientRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
