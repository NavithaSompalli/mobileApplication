import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // For displaying toast messages
import { ServiceService } from '../service.service'; // Custom service for login and state sharing

// Angular component configuration
@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrl: './login.component.css',
   standalone: false
})
export class LoginComponent implements OnInit {
   userType: string = ""; // Stores selected user type ('parent' or 'child')
   username: string = ""; // Stores the entered username
   password: string = ""; // Stores the entered password
   visible: boolean = false; // May control visibility of a password input or modal

   constructor(
      private router: Router, // For navigation between routes
      private message: MessageService, // To show messages (toasts)
      private service: ServiceService   // Service for authentication and user data management
   ) { }

   // Called when user selects a user type from a dropdown or similar control
   onSelectUserType(value: string) {
      this.userType = value;
      // console.log(this.userType);
   }

   ngOnInit() {
      if (localStorage.getItem('userType') === 'parent') {
         this.router.navigate(['home'])
      } else if (localStorage.getItem('userType') === 'child') {
         this.router.navigate(['child']);
      }
   }

   // Called when user submits the login form
   onSubmitLogin() {
      // Basic client-side validation for empty fields
      if (!this.username || !this.password) {
         let message = '';

         if (!this.username && !this.password) {
            message = 'Please fill the username and password fields';
         } else if (!this.username) {
            message = 'Please fill the username field';
         } else if (!this.password) {
            message = 'Please fill the password field';
         }

         // Show error message using PrimeNG's message service
         this.message.add({ severity: 'error', detail: message, life: 3000 });
         return;
      }

      // Only proceed if the userType is either 'parent' or 'child'
      if (this.userType === 'parent' || this.userType === 'child') {
         // Call the login method from the service
         this.service.login(this.username, this.password).subscribe({
            next: (users) => {
               console.log(users); // For debugging

               // Find a matching user in the returned user list
               const foundUser = users.find(user =>
                  user.username === this.username && user.password === this.password
               );

               // If a parent logs in successfully
               if (foundUser && this.userType === 'parent') {
                  localStorage.setItem('authToken', 'true'); // Save auth flag
                  localStorage.setItem('userType', 'parent');
                  this.router.navigate(['home']);            // Navigate to parent home page
                  // this.service.updateUser(users);            // Possibly update shared user state
               }
               // If a child logs in successfully
               else if (foundUser && this.userType === "child") {
                  localStorage.setItem('authToken', 'true'); // Store authToken if the user is loggedin
                  localStorage.setItem('userId', foundUser.id); // Store child's ID separately
                  localStorage.setItem('userType', 'child');
                  // console.log(foundUser.id);                   
                //  this.service.updateUser(foundUser);          // Update state with single user
                  this.router.navigate(['child']);             // Navigate to child's view
               }
               // No match found: invalid credentials
               else {
                  this.message.add({ severity: 'error', detail: 'Invalid credentials', life: 3000 });
               }
            },
            error: () => {
               // Handle any backend or HTTP error
               this.message.add({ severity: 'error', detail: 'Server error', life: 3000 });
            }
         });
      }
   }

   onGoBack(){
      this.userType = '';
   }
}
