import { Component } from '@angular/core';
import {StorageService} from "../service/storage.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private storageService: StorageService) {}
  showTabs = false;
  ngOnInit(): void {
    this.storageService.get("jwt").then((value) => {
      if (value) {
        this.showTabs = true;
      }
    });
    this.storageService.jwtChangedSub.subscribe((jwt) => {
      if(jwt) {
        this.showTabs = true;
      } else {
        this.showTabs = false;
      }
    })
  }
}
