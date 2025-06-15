import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataManagementPage } from './data-management.page';

describe('DataManagementPage', () => {
  let component: DataManagementPage;
  let fixture: ComponentFixture<DataManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
