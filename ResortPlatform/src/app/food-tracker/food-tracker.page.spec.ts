import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FoodTrackerPage } from './food-tracker.page';

describe('Tab1Page', () => {
  let component: FoodTrackerPage;
  let fixture: ComponentFixture<FoodTrackerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodTrackerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
