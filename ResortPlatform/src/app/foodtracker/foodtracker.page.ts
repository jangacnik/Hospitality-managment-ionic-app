import {Component, OnInit} from '@angular/core';
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-foodtracker',
  templateUrl: 'foodtracker.page.html',
  styleUrls: ['foodtracker.page.scss']
})
export class FoodtrackerPage implements OnInit{
  openModal = false
  constructor() {

  }
  ngOnInit(): void {
  }

  openDialog(isOpen: boolean) {
    this.openModal = isOpen;
  }

  scanWasSuccessful(json: string){
    this.openModal = false;
    // console.log(json);
  }
}
