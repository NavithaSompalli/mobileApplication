import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  standalone: false
})
export class ChildComponent implements OnInit {
  userObject: any; // Stroing the current child logged object
  apps: any[] = []; // Stroing apps which are having the permission to use
  
  constructor(public service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    let userId = localStorage.getItem("userId") // Retriving the userId from the local storage
    // This will return object based on the userId from the json server.
    this.service.getUserById(userId).subscribe({
      next: (response) => {
        this.userObject = response; // Updating the userObject with response 
        this.apps = this.userObject.apps.filter(obj => {obj.enabled
            const totalSeconds = obj.usedTime;
                            obj['usedTimes'] = Math.floor(totalSeconds / 60);// minutes
                            return obj;
        }); // Filtering apps based on the enabled property is true

        console.log(this.userObject);
      }
    })
  }

  // Method triggered when the user chooses to app
  onPlay(app: any, url: string, index: number): void {

    // Navigate to the 'video' route with the app ID as a parameter
    // Also pass additional data via router state
    this.router.navigate(['video', app.id], {
      state: { appData: this.userObject, index: index }
    });
  }
}
