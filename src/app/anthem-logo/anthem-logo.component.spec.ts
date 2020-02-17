import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnthemLogoComponent } from './anthem-logo.component';

describe('AnthemLogoComponent', () => {
  let component: AnthemLogoComponent;
  let fixture: ComponentFixture<AnthemLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnthemLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnthemLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
