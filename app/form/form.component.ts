
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
export class FormComponent{
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
    let user = {
      name: this.createApp?.controls['appname'].value,
      url: this.imageUrl,
      website: this.createApp?.controls['website'].value,
      usertype: this.addType,
      hour: '',
      enabled: false,
      usedTime: Date
    }

    this.service.onCreateUser(user).subscribe({
      next: (response) => console.log(response)
    })

    this.service.onGetUsers().subscribe({
      next: (response) => {
        response.forEach(item => {
          if (item.usertype === 'child') {
            item['apps'] = [...item['apps'], user]
            console.log("create App", item)
            this.service.saveUpdatedChild(item).subscribe({
              next: (response) => {
                console.log(response);
              }
            })
          }
        })

        //  this.router.navigate(['home']);
        this.message.add({ severity: 'success', detail: 'App created Successfully', life: 3000 })
      },
      error: () => {
        this.message.add({ severity: 'error', detail: 'Server error', life: 3000 });
      }
    })
  }

  onCreateChild() {
    if (this.createChild.invalid) {
      this.message.add({ severity: 'warn', detail: 'Please fill out all required fields', life: 3000 });
      return;
    }

  //  console.log(this.createChild)

    let user = {
      name: this.createChild.controls['name'].value,
      dateOfBirth: this.createChild.controls['dateOfBirth'].value,
      username: this.createChild.controls['username'].value,
      password: this.createChild.controls['password'].value,
      usertype: this.addType,
      apps: [],
      isPanelCollapsed: true
    };

    this.service.onCreateUser(user).subscribe({
      next: (response) => {
        this.router.navigate(['home']);
        this.message.add({ severity: 'success', detail: 'App created Successfully', life: 3000 });
      },
      error: () => {
        this.message.add({ severity: 'error', detail: 'Server error', life: 3000 });
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
