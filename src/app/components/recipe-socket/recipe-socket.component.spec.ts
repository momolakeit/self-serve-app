import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSocketComponent } from './recipe-socket.component';

describe('RecipeSocketComponent', () => {
  let component: RecipeSocketComponent;
  let fixture: ComponentFixture<RecipeSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
