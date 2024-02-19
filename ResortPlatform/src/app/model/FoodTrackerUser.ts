export class FoodTrackerUser {
  lastName: string;
  firstName: string;
  email: string;
  employeeNumber: string;
  departments: string[];
  roles: string[];

  constructor(lastName: string, firstName: string, email: string, employeeNumber: string, departments: string[], roles: string[]) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
    this.employeeNumber = employeeNumber;
    this.departments = departments;
    this.roles = roles;
  }
}
