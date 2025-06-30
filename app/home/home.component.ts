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

  onPanelToggle(panelId: string, tab: string) {
    this.permissionAppsList = this.childsList.filter(item => item.usertype === 'app')
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

  onLogout(){
    localStorage.clear();
    this.router.navigate(['']);
  }

    

}
