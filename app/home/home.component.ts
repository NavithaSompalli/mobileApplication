import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ServiceService } from '../service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';



export interface PermissionApp {
  id: string;
  name: string;
  url: string;
  website: string;
  usertype: string;
  hour?: any; // Adjust type if needed
  enabled?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})

export class HomeComponent implements OnInit {
  isToggleActive: boolean = false // enabled toggle button
  addType: string = ""
  childsList: any[] = [];
  filteredList: any[] = [];
  tabType: string = "app";
  hoursList: object[] = []
  selectedHour: object = {};
  isPanelCollapsed: boolean = true;
  permissionAppsList: PermissionApp[] = [];
  recordedChildList: object[] = [];
  initialLoading: boolean = true;


  constructor(private service: ServiceService, private message: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.handleChildAndAppList()
    this.hoursList = Array.from({ length: 24 }, (_, i) => {
      return { name: `${i + 1}`, value: i + 1 };
    });

  }

  handleChildAndAppList() {
    this.service.onGetUsers().subscribe({
      next: (response) => {
        this.childsList = response;
        this.filteredList = this.childsList.filter(item => item.usertype === this.tabType);
        this.permissionAppsList = this.childsList.filter(item => item.usertype === 'app');
        //  console.log("ngOnInit", this.permissionAppsList)
      }
    })
  }
  onSelectUserType(user: string) {
    this.service.addType = user;
    this.router.navigate(['form'])
  }

  onPanelToggle(obj) {
    this.service.saveUpdatedChild(obj).subscribe({
      next: response => {
        this.handleChildAndAppList();
      }
    });
  }

  onSelectedTab(value: string) {
    this.tabType = value;
    this.handleChildAndAppList();
    this.isToggleActive = false;
  }

  onAppToggleChange(app: any, child: any) {
    if (app.enabled) {
      if (!child["apps"]) {
        child["apps"] = [];
      }

      console.log(child);
      this.service.saveUpdatedChild(child).subscribe({
        next: response => {
          this.handleChildAndAppList();
        }
      })
    }
  }

  onToggleButton() {
    this.isToggleActive = !this.isToggleActive
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  onDelete(id: string): void {
  this.service.onDeleteUser(id).subscribe({
    next: () => {
      // Step 1: Delete the app
      this.message.add({
        severity: 'success',
        detail: 'App deleted successfully',
        life: 3000
      });

      // Step 2: Fetch all users and update affected child records
      this.service.onGetUsers().subscribe({
        next: (users) => {
          users.forEach(child => {
            if (child.usertype === 'child' && Array.isArray(child.apps)) {
              const updatedApps = child.apps.filter(app => app.id !== id);
              
              if (updatedApps.length !== child.apps.length) {
                const updatedChild = { ...child, apps: updatedApps };
                this.service.saveUpdatedChild(updatedChild).subscribe({
                  next: () => console.log(`Updated child ${child.id}`),
                  error: err => console.error('Child update failed:', err)
                });
              }
            }
          });
        },
        error: () => {
          this.message.add({
            severity: 'error',
            detail: 'Failed to update child apps',
            life: 3000
          });
        }
      });

      // Step 3: Refresh local data/view
      this.handleChildAndAppList();
    },
    error: () => {
      this.message.add({
        severity: 'error',
        detail: 'Delete failed',
        life: 3000
      });
    }
  });
}

}
