
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServiceService } from '../service.service';



@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrl: './login.component.css',
   standalone: false
})
export class LoginComponent {
   userType: string = "";
   username: string = "";
   password: string = "";
   visible: boolean = false;

   constructor(private router: Router, private message: MessageService, private service: ServiceService) { }


   onSelectUserType(value: string) {
      this.userType = value;
      console.log(this.userType)
   }

   // Submit function
   onSubmitLogin() {
      if (!this.username || !this.password) {
         let message = '';

         if (!this.username && !this.password) {
            message = 'Please fill the username and password fields';
         } else if (!this.username) {
            message = 'Please fill the username field';
         } else if (!this.password) {
            message = 'Please fill the password field';
         }

         this.message.add({ severity: 'error', detail: message, life: 3000 });
         return;
      }

      if (this.userType === 'parent' || this.userType === 'child') {
         this.service.login(this.username, this.password).subscribe({
            next: (users) => {
              // console.log("login", users);
              console.log(users);
               const foundUser = users.find(user =>
                  user.username === this.username && user.password === this.password
               );
               if (foundUser && this.userType === 'parent') {
                  localStorage.setItem('authToken', 'true');
                  this.router.navigate(['home']);
                  this.service.updateUser(users);
               } else if (foundUser && this.userType === "child") {
                  localStorage.setItem('authToken', 'true');
                  localStorage.setItem('userId', foundUser.id)
                  console.log(foundUser.id);
                  this.service.updateUser(foundUser);
                  //   localStorage.clear();
                  //  localStorage.setItem("foundUser", JSON.stringify(foundUser));
                  this.router.navigate(['child']);
               } else {
                  this.message.add({ severity: 'error', detail: 'Invalid credentials', life: 3000 });
               }
            },
            error: () => {
               this.message.add({ severity: 'error', detail: 'Server error', life: 3000 });
            }
         });
      } else {
         this.message.add({ severity: 'warn', detail: 'Please select a valid user type', life: 3000 });
      }
   }
}
