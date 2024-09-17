import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomescreenPage } from './homescreen.page';

describe('HomescreenPage', () => {
  let component: HomescreenPage;
  let fixture: ComponentFixture<HomescreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomescreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
