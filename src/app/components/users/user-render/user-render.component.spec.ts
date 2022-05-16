import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRenderComponent } from './user-render.component';

describe('UserRenderComponent', () => {
  let component: UserRenderComponent;
  let fixture: ComponentFixture<UserRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
