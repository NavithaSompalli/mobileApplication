
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ServiceService } from '../service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: false
})
export class FormComponent {
  @ViewChild('createApp') createApp?: NgForm;
  @ViewChild('createChild') createChild?: NgForm;
  name: string = "";
  dob: string = "";
  username: string = "";
  password: string = "";
  Appname: string = "";
  urlIcon: string = "";
  website: string = "";
  imageUrl?: string;
  addType: string;
  appAndUsersList: any[] = [];


  constructor(private service: ServiceService, private message: MessageService, private router: Router) { }

  ngOnInit() {
    this.addType = this.service.addType
    this.service.userData$.subscribe((user) => {
      this.appAndUsersList = user;
      console.log(this.appAndUsersList)
    })
  }

  onCreateApp() {
    const appName = this.createApp?.controls['appname'].value;

    this.service.onGetUsers().subscribe({
      next: (users) => {
        const appAlreadyExists = users.some(user =>
          user?.apps?.some(app => app.name === appName)
        );

        if (appAlreadyExists) {
          this.message.add({
            severity: 'warn',
            detail: 'App is already registered',
            life: 3000
          });
          return;
        }

        const user = {
          name: appName,
          url: this.imageUrl,
          website: this.createApp?.controls['website'].value,
          usertype: this.addType,
          hour: '',
          enabled: false,
          usedTime: Date
        };

        this.service.onCreateUser(user).subscribe({
          next: (response) => {
            this.router.navigate(['home'])
            console.log(response)
          }
        });

        users.forEach(item => {
          if (item.usertype === 'child') {
            item['apps'] = [...item['apps'], user];
            this.service.saveUpdatedChild(item).subscribe({
              next: (response) => console.log(response)
            });
          }
        });

        this.message.add({
          severity: 'success',
          detail: 'App created successfully',
          life: 3000
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


  onCreateChild() {
    if (this.createChild.invalid) {
      this.message.add({ severity: 'warn', detail: 'Please fill out all required fields', life: 3000 });
      return;
    }

    console.log("create Child")

    // Extract input values once
    const newName = this.createChild.controls['name'].value.trim().toLowerCase();
    const newUsername = this.createChild.controls['username'].value.trim().toLowerCase();

    this.service.onGetUsers().subscribe({
      next: response => {
        const appsList = response.filter(u => u.usertype === 'app');
        const existingChildren = response.filter(u => u.usertype === 'child');

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

        const user = {
          name: this.createChild.controls['name'].value,
          dateOfBirth: this.createChild.controls['dateOfBirth'].value,
          username: this.createChild.controls['username'].value,
          password: this.createChild.controls['password'].value,
          usertype: this.addType,
          apps: [...appsList],
          isPanelCollapsed: true
        };

        this.service.onCreateUser(user).subscribe({
          next: () => {
            this.router.navigate(['home']);
            this.message.add({ severity: 'success', detail: 'Child Added Successfully', life: 3000 });
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


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        // Ensure this is inside the onload function
      };
      reader.readAsDataURL(file);
    }
  }

  onClickDiscard() {
    this.addType = "";
    this.router.navigate(['home']);
  }
}
