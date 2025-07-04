
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServiceService } from '../service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: false
})
export class FormComponent {
  // Access template-driven form elements via template reference variables
  @ViewChild('createApp') createApp?: NgForm;
  @ViewChild('createChild') createChild?: NgForm;
  // Define input model properties for both forms
  name: string = "";
  dob: string = "";
  username: string = "";
  password: string = "";
  Appname: string = "";
  urlIcon: string = "";
  website: string = "";
  imageUrl?: string = "";
  addType: string; // Stores type of user ('app' or 'child')
  appAndUsersList: any[] = []; // Stores a combined list of apps and users from the service
  uploadLabel: string = 'Upload Image';
  today: Date = new Date();

  constructor(private service: ServiceService, private message: MessageService, private router: Router) { }

  ngOnInit() {
    this.addType = this.service.addType // Set type of user
    // // Subscribe to a shared Observable to get list of apps and users
    // this.service.userData$.subscribe((user) => {
    //   this.appAndUsersList = user;
    //   console.log(this.appAndUsersList)
    // })
  }

  // Handle logic to create a new app
  onCreateApp() {
    // Accessing  form input values from NgForm object.
    const appName = this.createApp?.controls['appname']?.value.trim().toLowerCase();
    const urlIcon = this.createApp?.controls['websites']?.value.trim().toLowerCase();

    // Validate fields
    if (appName === '' || urlIcon === '' || this.imageUrl === '') {
      this.message.add({
        severity: 'error',
        detail: 'Please Enter All the fields',
        life: 3000
      });
    } else {
      // Fetch users from server to check for duplicates
      this.service.onGetUsers().subscribe({
        next: (users) => {
          const appAlreadyExists = users.some(user =>
            user?.apps?.some(app => app.name === appName)
          );
          // Show warning if app is already registered
          if (appAlreadyExists) {
            this.message.add({
              severity: 'warn',
              detail: 'App is already registered',
              life: 3000
            });
            return;
          }

          // Define new app object
          const user = {
            id: Math.floor(Math.random() * 1000).toString(),
            name: appName,
            url: this.imageUrl,
            website: this.createApp?.controls['website'].value,
            usertype: this.addType,
            hour: '',
            enabled: false,
            usedTime: Date
          };

          // Save the new app to the jsonserver
          this.service.onCreateUser(user).subscribe({
            next: (response) => {
              this.message.add({
                severity: 'success',
                detail: 'App created successfully',
                life: 3000
              });
              this.router.navigate(['home']); // Redirect to home after creation
            }
          });

          // Add new app to all child users
          users.forEach(item => {
            if (item.usertype === 'child') {
              item['apps'] = [...item['apps'], user]; // Append app to existing apps
              this.service.saveUpdatedChild(item).subscribe({
                next: (response) => console.log(response)
              });
            }
          });

        },
        error: () => {
          this.message.add({
            severity: 'error',
            detail: 'Server error',
            life: 3000
          });
        }
      });
    }
  }

  // Handle creation of a new child user
  onCreateChild() {
    if (this.createChild.invalid) { // it will check when a form is submitted but not all required fields have been filled in correctly are not.
      this.message.add({ severity: 'warn', detail: 'Please fill out all required fields', life: 3000 });
      return;
    }

    console.log(this.createChild);
    // Extract input values once
    const newName = this.createChild.controls['name'].value.trim().toLowerCase();
    const newUsername = this.createChild.controls['username'].value.trim().toLowerCase();

    this.service.onGetUsers().subscribe({
      next: response => {
        const appsList = response.filter(u => u.usertype === 'app'); // Get all apps
        const existingChildren = response.filter(u => u.usertype === 'child'); // Get all childrens

        // Check if name or username already exists
        const nameExists = existingChildren.some(u => u.name?.trim().toLowerCase() === newName);
        const usernameExists = existingChildren.some(u => u.username?.trim().toLowerCase() === newUsername);

        if (nameExists || usernameExists) {
          this.message.add({
            severity: 'warn',
            detail: nameExists
              ? 'A child with this name already exists'
              : 'Username is already taken',
            life: 3000
          });
          return;
        }

        // Construct new child object
        const user = {
          name: this.createChild.controls['name'].value,
          dateOfBirth: this.createChild.controls['dateOfBirth'].value,
          username: this.createChild.controls['username'].value,
          password: this.createChild.controls['password'].value,
          usertype: this.addType, // Assign all apps to this new child
          apps: [...appsList],
          isPanelCollapsed: true
        };

        // Save new child to the jsonserver
        this.service.onCreateUser(user).subscribe({
          next: () => {
            this.router.navigate(['home']); // Redirect after creation
            this.message.add({ severity: 'success', detail: 'Child Added Successfully', life: 3000 });
            this.createChild.resetForm();
          },
          error: () => {
            this.message.add({ severity: 'error', detail: 'Server error', life: 3000 });
          }
        });
      },
      error: () => {
        this.message.add({ severity: 'error', detail: 'Failed to fetch users', life: 3000 });
      }
    });
  }

  // File input handler for setting imageUrl using FileReader
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader(); // Convert image to base64 and store
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        // Ensure this is inside the onload function
        this.uploadLabel = `${this.Appname} logo got uploaded`;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle discard action: clear type and navigate back home
  onClickDiscard() {
    this.addType = "";
    this.router.navigate(['home']);
  }
}
