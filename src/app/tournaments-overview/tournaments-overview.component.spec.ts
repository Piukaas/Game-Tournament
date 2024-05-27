import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsOverviewComponent } from './tournaments-overview.component';

describe('TournamentsOverviewComponent', () => {
  let component: TournamentsOverviewComponent;
  let fixture: ComponentFixture<TournamentsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
