import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import {ToastController, ViewDidEnter} from '@ionic/angular';
import {FoodTrackerUser} from "../model/FoodTrackerUser";
import {today} from "ionicons/icons";
import {zip} from "rxjs";
import {TaskService} from "../service/task.service";

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
  public dataStatusMsg: string = '';
  public selectedDate: string = new Date().toDateString();
  public selectedDepartment: string;
  public taskLists: any;
  public completedTasks: number[] = [];
  public showScrollButton: boolean = false;
  private initial = true;
  selectedTask: any = undefined;
  selectedTaskListId: string = undefined;
  selectedTaskIndex: any = undefined;
  constructor(
    private _userService: UserService,
    private _toastController: ToastController,
    private _taskService: TaskService
  ) {}
  todayDate: Date = undefined;
  maxDate: string;
  fdUser: FoodTrackerUser;
  dataReady = false;
  taskLoading = false;
  taskListsAll: any = [];
  myTaskLists: any = [];
  selectedList: string;
  sDate: Date= undefined;
  selectedDepId = "";

  availableShifts: any = undefined;
  isAdmin = false;
  ngOnInit() {

    this.initData();
  }

  initData() {
    this.taskLoading = true;
    if (this.initial) {
      const today = new Date();
      this.todayDate = today;
      this.maxDate = today.toISOString();
      this.selectedDate = today.toISOString();
      this.todayDate.setHours(0,0,0,0);
      this.sDate = this.todayDate;

    }
    const d = this.selectedDate.split('T')[0];
    zip(this._userService.getUserInfo(),
      this._userService
        .getTaskList(d))
      .subscribe(val => {
        this.fdUser = val[0];
        this.taskLists = val[1];
        // console.log(this.fdUser);
        if (this.initial) {
          const dep: any = this.fdUser.departments[0];
          this.selectedDepId = dep.departmentId;
          if (this.fdUser.roles.includes("ADMIN")) {
            this._userService.getAvailableShifts(d,this.selectedDepId).subscribe(
              {
                next: shifts => {
                  this.availableShifts = shifts;
                  this.isAdmin = true;
                },
                error: err => {
                  this.isAdmin = false;
                  this.availableShifts = undefined;
                }
              }
            );
          }

          this.selectedDepartment = dep.departmentName;
        }
        this.taskListsAll = this.taskLists.filter(taskL => taskL.departments
          .findIndex(dep => dep.departmentName === this.selectedDepartment) > -1);
        const filteredTaks = JSON.parse(JSON.stringify(this.taskListsAll));
        this.myTaskLists = [];
        for(let taskL of filteredTaks) {
          let myTasks = taskL.tasks.filter(tk => tk.assigne && this.fdUser.employeeNumber === tk.assignee.userId);
          if (myTasks && myTasks.length > 0) {
            let lst = taskL;
            lst.tasks = myTasks;
            this.myTaskLists.push(lst);
          }
        }
        this.selectedList = "today";
        this.initial = false;

        setTimeout(()=>{
          this.taskLoading = false;}, 750);
      });

  }

  disableTask() {
    return this.todayDate > this.sDate;
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
  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.userId === o2.userId : o1 === o2;
  };

  onDismissTask(event) {
  }
  updateTaskLists() {
    this.taskLoading = true;
    this.sDate = new Date(this.selectedDate);
    this.sDate.setHours(0,0,0,0);
    if(!this.fdUser) {
      this.initData();
    } else {
      this._userService
        .getTaskList(this.selectedDate.split('T')[0]).subscribe({
        next: (val: any) => {
          this.taskLists = val;
          this.taskListsAll = val.filter(taskL =>
            taskL.departments.findIndex(dep => dep.departmentName === this.selectedDepartment) !== -1);
          const filteredTaks = JSON.parse(JSON.stringify(this.taskListsAll));
          this.myTaskLists = [];
          // const filteredTasks =
          for(let taskL of filteredTaks) {
            const myTasks = taskL.tasks.filter(tk => tk.assignee && this.fdUser.employeeNumber === tk.assignee.userId);
            if (myTasks && myTasks.length > 0) {
              let lst = taskL;
              lst.tasks = myTasks;
              this.myTaskLists.push(lst);
            }
          }
          if (this.fdUser.roles.includes("ADMIN")) {
            this._userService.getAvailableShifts(this.selectedDate.split("T")[0],this.selectedDepId).subscribe(
              {
                next: shifts => {
                  this.availableShifts = shifts;
                  this.isAdmin = true;
                },
                error: err => {
                  this.isAdmin = false;
                  this.availableShifts = undefined;
                }
              }
            );
          }
          setTimeout(()=>{
            this.taskLoading = false;}, 750);
        },
        error: err => {
          setTimeout(()=>{
            this.taskLoading = false;}, 750);
        }
      });
    }
  }

  onDepartmetnChange(depName) {
    this.selectedDepartment = depName.departmentName;
    this.selectedDepId = depName.departmentId;
    this.updateTaskLists();
  }

  toggleDone(task: any, taskList: any, indexI: number) {
    let user = this._userService.foodTrackerUser;
    const dataModel = {
      user: {
        userId: user.employeeNumber,
        name: user.firstName,
        surname: user.lastName,
      },
      taskListId: taskList,
      taskId: task.id,
    };

    this._userService.changeTaskStatus(dataModel).subscribe({
      next: (val) => {
        // this.completedTasks[indexI] = this.countNumOfCompletedTasks(
        //         //   taskList.tasks
        //         // );
      },
      error: (err) => {
        task.completed = !task.completed;
        this.presentToast('There was problem ticking the task');
      },
    });
  }

  allTaskCompleted(taskList: any[]): boolean {
    // console.log(taskList);
    return !(taskList.findIndex(tsk => !tsk.completed) > -1);
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


  ionViewDidEnter(): void {
    if (!this.initial) {
      this.updateTaskLists();
    }
  }

  openTaskModal = false;
  onTaskClick(task, taskList, index) {
    this.selectedTask = task;
    this.selectedTaskListId = taskList.id;
    this.selectedTaskIndex = index;
    this.openTaskModal = true;
  }
  onTaskClose() {
    console.log(this.selectedTask);
    this.selectedTask = undefined;
    this.selectedTaskListId = undefined;
    this.selectedTaskIndex = undefined;
    this.openTaskModal = false;
  }


  assignTask(user) {
    this._taskService.assignUser(user.detail.value,this.selectedTaskListId, this.selectedTask.id).subscribe(
      {
        next: () =>{
        },
        error: err => {}
      }
    );
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.updateTaskLists();
      // Any calls to load data go here
      event.target.complete();
    }, 1000);
  }
}
