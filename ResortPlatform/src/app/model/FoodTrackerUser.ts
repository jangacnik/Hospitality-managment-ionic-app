export class FoodTrackerUser {
  lastName: string;
  firstName: string;
  email: string;
  employeeNumber: string;
  departments: string[];

  constructor(lastName: string, firstName: string, email: string, employeeNumber: string, departments: string[]) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
    this.employeeNumber = employeeNumber;
    this.departments = departments;
  }
}
