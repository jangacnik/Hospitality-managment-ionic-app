import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import {ToastController, ViewDidEnter} from '@ionic/angular';
import {FoodTrackerUser} from "../model/FoodTrackerUser";
import {today} from "ionicons/icons";

interface ChecklistItem {
  //TODO: naret model (deletnit to)
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
})
export class TodoListPage implements OnInit, ViewDidEnter {
  // public items: ChecklistItem[] = [ //TODO: delete
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  //   { label: 'TODO 1', done: false },
  //   { label: 'TODO 2', done: false },
  //   { label: 'TODO 3', done: false },
  // ];

  public dataStatusMsg: string = '';
  public selectedDate: string = new Date().toDateString();
  public selectedDepartment: string;
  public taskLists: any;
  public completedTasks: number[] = [];
  public showScrollButton: boolean = false;
  private initial = true;
  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   console.log('scroll');
  //   this.showScrollButton = window.scrollY > 1; // Adjust the threshold as needed
  // }

  constructor(
    private _userService: UserService,
    private _toastController: ToastController
  ) {}
  maxDate: string;
  fdUser: FoodTrackerUser;
  dataReady = false;
  ngOnInit() {
    this.initData();
  }

  initData() {
    this.fetchTaskLists();
    this._userService.getUserInfo().subscribe(data => {
      this.fdUser = data;
      if (this.initial)
      this.selectedDepartment = this.fdUser.departments[0];
      this.dataReady = true;
    });
    if (this.initial) {
      const today = new Date();
      this.selectedDate = today.toISOString();
      this.maxDate = today.toISOString();
    }
  }

  countNumOfCompletedTasks(taskList: any) {
    let numOfCompleted = 0;
    for (let task of taskList) {
      if (task.completed) {
        numOfCompleted += 1;
      }
    }
    return numOfCompleted;
  }

  fetchTaskLists() {
    this._userService
      .getTaskList(this.selectedDate.split('T')[0])
      .subscribe({
        next: (data) => {
          this.taskLists = data;
          if (this.taskLists === undefined || this.taskLists.length == 0) {
            this.dataStatusMsg = 'No data for this date';
          } else {
            this.dataStatusMsg = '';

            // Count number of completed tasks
            for (let taskList of this.taskLists) {
              let num = this.countNumOfCompletedTasks(taskList.tasks);
              this.completedTasks.push(num);
            }
          }
        },
        error: (error) => {
          this.dataStatusMsg =
            'There was problem fetching to-do list for this date';
        },
      });
  }

  onDepartmetnChange(depName) {
    this.selectedDepartment = depName;
  }

  toggleDone(task: any, taskList: any, indexI: number) {
    let user = this._userService.foodTrackerUser;
    const dataModel = {
      //TODO: model
      user: {
        userId: user.employeeNumber,
        name: user.firstName,
        surname: user.lastName,
      },
      taskListId: taskList.id,
      taskId: task.id,
    };

    this._userService.changeTaskStatus(dataModel).subscribe({
      next: (val) => {
        this.completedTasks[indexI] = this.countNumOfCompletedTasks(
          taskList.tasks
        );
      },
      error: (err) => {
        task.completed = !task.completed;
        this.presentToast('There was problem ticking the task');
      },
    });
  }

  setTimeZone() {
    // Get timezone offset
    const date = new Date(this.selectedDate);
    const offset = date.getTimezoneOffset();
    this.selectedDate = new Date(
      date.getTime() - offset * 60 * 1000
    ).toISOString();
  }




  showCalendar = false;
  openCalendar() {
    this.showCalendar = true;
  }
  cancelCalendar() {
    this.showCalendar = false;
  }
  async presentToast(msg: string) {
    //TODO: premaknit v nek service za vse komponente
    const toast = await this._toastController.create({
      message: msg,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

    protected readonly Date = Date;

  ionViewDidEnter(): void {
    this.initData();
    this.initial = false;
  }
}
