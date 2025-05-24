import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIconPickerComponent } from './dashboard-icon-picker.component';

describe('DashboardIconPickerComponent', () => {
  let component: DashboardIconPickerComponent;
  let fixture: ComponentFixture<DashboardIconPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardIconPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardIconPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
