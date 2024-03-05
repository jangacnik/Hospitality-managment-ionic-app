import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user.service';
import {ToastController, ViewDidEnter} from '@ionic/angular';
import {FoodTrackerUser} from "../model/FoodTrackerUser";
import {zip} from "rxjs";
import {TaskService} from "../service/task.service";
import {Keyboard, KeyboardInfo, KeyboardResize} from '@capacitor/keyboard';
import {star} from "ionicons/icons";

interface ChecklistItem {
  //TODO: naret model (deletnit to)
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit, ViewDidEnter {
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


  stars:number = 0;
  comment: any;
  rating: any;
  ngOnInit() {
    this.initData();
    Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
      Keyboard.setResizeMode({mode: KeyboardResize.Native}).then();
    });
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.setResizeMode({mode: KeyboardResize.None}).then();
    });
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
        this.taskListsAll = this.filterTaskList(this.taskLists);
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

  filterTaskList(taskList) {
    let lists = [];
    let listIds = []
    for (let tasks of taskList) {
        const f = tasks.departments.filter(t => t.departmentName === this.selectedDepartment);
        if (f.length > 0) {
          listIds.push(tasks.id);
          lists.push(tasks);
        }
    }
    return lists.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id
        ))
    )
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
            this.taskListsAll = this.filterTaskList(this.taskLists);
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
  commentText = "";
  isMyTask = false;
  onTaskClick(task, taskList, index, isMyTask) {
    this.isMyTask = isMyTask;
    this.selectedTask = task;
    this.selectedTaskListId = taskList.id;
    this.selectedTaskIndex = index;

    if (this.isAdmin) {
      if (this.selectedTask.supervisorRatings && this.selectedTask.supervisorRatings.length > 0) {
        this.rating = this.selectedTask.supervisorRatings.filter((rate) => rate.supervisor.userId === this.fdUser.employeeNumber);
      }
      this.stars = this.rating && this.rating.length > 0 ? this.rating[0].rating : 0;
      if (this.selectedTask.supervisorComments
        && this.selectedTask.supervisorComments.length > 0) {
        const comment = this.selectedTask.supervisorComments.filter((cmt) => cmt.supervisor.userId === this.fdUser.employeeNumber);
        this.comment = comment && comment.length > 0 ? comment[0] : undefined;
      }
      this.commentText = this.comment ? this.comment.supervisorComments: "";
    } else {
      if(this.selectedTask.supervisorRatings && this.selectedTask.supervisorRatings.length > 0) {
        let st = 0;
        for (let r of this.selectedTask.supervisorRatings) {
          st += r.rating;
        }
        this.stars = st / this.selectedTask.supervisorRatings.length;
      } else {
        this.stars = 0;
      }
    }

    this.openTaskModal = true;
  }
  onTaskClose() {
    if (this.isMyTask) {
      this.myTaskLists[this.selectedTaskIndex] = this.selectedTask;
    } else {
      this.taskListsAll[this.selectedTaskListId] = this.selectedTask;
    }
    this.isMyTask = false;
    this.selectedTask = undefined;
    this.selectedTaskListId = undefined;
    this.selectedTaskIndex = undefined;
    this.openTaskModal = false;
    this.rating = undefined;
    this.stars = 0;
    this.comment = undefined;
    this.commentText = undefined;
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

  starClicked(i:number, selectedTaskListId, selectedTask){
    const user = {
      "userId": this.fdUser.employeeNumber,
      "name": this.fdUser.firstName,
      "surname": this.fdUser.lastName
    }
    this.stars=i;
    this._taskService.addRating(user, selectedTaskListId, selectedTask.id, i).subscribe(
      {
        next: (task) =>{
          this.selectedTask.supervisorRatings = task.supervisorRatings;
        },
        error: err => {}
      }
    );
  }

  commentWritten(selectedTaskListId, selectedTask){
    const user = {
      "userId": this.fdUser.employeeNumber,
      "name": this.fdUser.firstName,
      "surname": this.fdUser.lastName
    }
    this._taskService.addComment(user, selectedTaskListId, selectedTask.id, this.commentText).subscribe(
      {
        next: (task) =>{
          this.selectedTask.supervisorComments = task.supervisorComments;
        },
        error: err => {}
      }
    );
  }

  protected readonly undefined = undefined;
}
