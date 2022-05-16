import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetRenderComponent } from './tweet-render.component';

describe('TweetRenderComponent', () => {
  let component: TweetRenderComponent;
  let fixture: ComponentFixture<TweetRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TweetRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
