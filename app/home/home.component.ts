import { AfterViewInit, Component, OnInit, ViewChild,Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ServiceService } from '../service.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';



// export interface PermissionApp {
//   id: string;
//   name: string;
//   url: string;
//   website: string;
//   usertype: string;
//   hour?: any; // Adjust type if needed
//   enabled?: boolean;
// }

//permissionAppsList: PermissionApp[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: false
})

export class HomeComponent implements OnInit {
  isToggleActive: boolean = false // enabled toggle button
  addType: string = "" // Stores the current user/app type being created
  childsList: any[] = []; // Full list of users/apps fetched from server
  filteredList: any[] = []; // Filtered list based on selected tab type
  tabType: string = "app"; // Current tab selected in UI 

  

  constructor(private service: ServiceService, private message: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.handleChildAndAppList() // Load data initially
    this.tabType = this.service.addType;
  }

  // Fetch all users and filter based on selected user type (app/child)
  handleChildAndAppList() {
    this.service.onGetUsers().subscribe({
      next: (response) => {
        this.childsList = response;
        this.filteredList = this.childsList.filter(item => item.usertype === this.tabType);
      }
    })
  }

  // Navigate to form for creating a new app/child and update shared type
  onSelectUserType(user: string) {
    this.service.addType = user;
    this.router.navigate(['form'])
  }

  onSelectedTab(user){
    this.tabType = user;
    this.handleChildAndAppList();
  }

 

  // Handle toggle changes for enabling/disabling apps
  onAppToggleChange(child: any) {
    this.service.saveUpdatedChild(child).subscribe({
      next: response => {
       // this.handleChildAndAppList();
      }
    })
  }

 
  // Handle app deletion and remove it from any child’s app list
  onDelete(id: string): void {
    this.service.onDeleteUser(id).subscribe({
      next: () => {
        // Shows the message when app is deleted
        this.message.add({
          severity: 'success',
          detail: 'App deleted successfully',
          life: 3000
        });

        //  Update any child that had this app in its list
        this.service.onGetUsers().subscribe({
          next: (users) => {
            users.forEach(child => {
              // Only update if child has an app list and matches the 'child' type
              if (child.usertype === 'child' && Array.isArray(child.apps)) {
                const updatedApps = child.apps.filter(app => app.id !== id);
                if (updatedApps.length !== child.apps.length) {
                  // Replace child’s apps with the filtered list
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
            // Show message if child update fails
            this.message.add({
              severity: 'error',
              detail: 'Failed to update child apps',
              life: 3000
            });
          }
        });

        // Refresh list after deletion
        this.handleChildAndAppList();
      },
      error: () => {
        // App deletion failed
        this.message.add({
          severity: 'error',
          detail: 'Delete failed',
          life: 3000
        });
      }
    });
  }

}
