import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ToastController } from '@ionic/angular';

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
export class TodoListPage implements OnInit {
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
  public selectedDate = new Date();
  public taskLists: any;
  public completedTasks: number[] = [];
  public showScrollButton: boolean = false;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   console.log('scroll');
  //   this.showScrollButton = window.scrollY > 1; // Adjust the threshold as needed
  // }

  constructor(
    private _userService: UserService,
    private _toastController: ToastController
  ) {}

  ngOnInit() {
    this.fetchTaskLists();
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
      .getTaskList(this.selectedDate.toISOString().split('T')[0])
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
    const offset = this.selectedDate.getTimezoneOffset();
    this.selectedDate = new Date(
      this.selectedDate.getTime() - offset * 60 * 1000
    );
  }

  changeDate(num: number) {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + num
    );

    this.setTimeZone();
    this.fetchTaskLists();
  }

  isButtonDisabled() {
    if (this.selectedDate.toDateString() == new Date().toDateString()) {
      return true;
    }
    return false;
  }

  // scrollToTop() {
  //   document.body.scrollTop = 0; // For Safari
  //   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  // }

  async presentToast(msg: string) {
    //TODO: premaknit v nek service za vse komponente
    const toast = await this._toastController.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      color: 'danger',
    });

    await toast.present();
  }
}
