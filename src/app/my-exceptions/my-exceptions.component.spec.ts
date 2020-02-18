import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExceptionsComponent } from './my-exceptions.component';

describe('MyExceptionsComponent', () => {
  let component: MyExceptionsComponent;
  let fixture: ComponentFixture<MyExceptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExceptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
