import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseJournalComponent } from './glucose-journal.component';

describe('GlucoseJournalComponent', () => {
  let component: GlucoseJournalComponent;
  let fixture: ComponentFixture<GlucoseJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlucoseJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
