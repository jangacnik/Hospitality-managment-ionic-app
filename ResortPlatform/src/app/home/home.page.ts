import {Component, OnInit} from '@angular/core';
import {StorageService} from "../service/storage.service";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  constructor(private storageService: StorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.storageService.get("jwt").then((value) => {
      if (!value) {
        this.router.navigate(['login'], {relativeTo: this.activatedRoute}).then();
      }
    });
  }

}
