import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataInsightsComponent } from './data-insights.component';

describe('DataInsightsComponent', () => {
  let component: DataInsightsComponent;
  let fixture: ComponentFixture<DataInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
