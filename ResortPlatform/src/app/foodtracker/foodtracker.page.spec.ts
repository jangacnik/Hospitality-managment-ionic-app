import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FoodtrackerPage } from './foodtracker.page';

describe('Tab2Page', () => {
  let component: FoodtrackerPage;
  let fixture: ComponentFixture<FoodtrackerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodtrackerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodtrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
