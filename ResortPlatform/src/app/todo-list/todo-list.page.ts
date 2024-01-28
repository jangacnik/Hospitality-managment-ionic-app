import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

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
  public dataStatusMsg = '';
  public selectedDate = new Date();
  public taskLists;
  public showScrollButton: boolean = false;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   console.log('scroll');
  //   this.showScrollButton = window.scrollY > 1; // Adjust the threshold as needed
  // }

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this.setTimeZone();
    this.fetchTaskLists();
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
          }
        },
        error: (error) => {
          this.dataStatusMsg = 'Something went wrong';
        },
      });
  }

  toggleDone(
    indexI: number,
    indexJ: number,
    taskListId: string,
    taskId: string
  ) {
    let user = this._userService.foodTrackerUser;
    const dataModel = {
      user: {
        userId: user.employeeNumber,
        name: user.firstName,
        surname: user.lastName,
      },
      taskListId: taskListId,
      taskId: taskId,
    };

    this._userService.changeTaskStatus(dataModel).subscribe({
      next: (val) => {
        this.taskLists[indexI]['tasks'][indexJ].completed =
          !this.taskLists[indexI]['tasks'][indexJ].completed;
      },
      error: (err) => {
        console.log('implement error msg'); //TODO
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
}
