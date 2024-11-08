import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentsHistoryPage } from './rents-history.page';

describe('RentsHistoryPage', () => {
  let component: RentsHistoryPage;
  let fixture: ComponentFixture<RentsHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RentsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
