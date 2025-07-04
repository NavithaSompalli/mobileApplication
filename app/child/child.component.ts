import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  standalone: false
})
export class ChildComponent implements OnInit {
  userObject: any; // Stroing the current child logged object
  apps: any[] = []; // Stroing apps which are having the permission to use
  //  destroyedTimes: Date[] = [];
  // usedTime?: number;

  constructor(public service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    let userId = localStorage.getItem("userId") // Retriving the userId from the local storage
    // This will return object based on the userId from the json server.
    this.service.getUserById(userId).subscribe({
      next: (response) => {
        this.userObject = response; // Updating the userObject with response 
        this.apps = this.userObject.apps.filter(obj => obj.enabled); // Filtering apps based on the enabled property is true
      }
    })

    // this.subscription.add(
    //   this.service.destroyed$.subscribe(date => {
    //     this.destroyedTimes.push(date);
    //     // Only calculate difference if at least two timestamps exist
    //     if (this.destroyedTimes.length >= 2) {
    //       const time1 = this.destroyedTimes[this.destroyedTimes.length - 1];
    //       const time2 = this.destroyedTimes[this.destroyedTimes.length - 2];
    //       const diffMs = time1.getTime() - time2.getTime();
    //       const diffSeconds = Math.floor(diffMs / 1000);
    //       const diffMinutes = Math.floor(diffSeconds / 60);
    //      // const diffHours = Math.floor(diffMinutes / 60);
    //       this.usedTime = diffMinutes;
    //       //console.log('usedTime', this.usedTime);
    //       // this.usedTime =  `${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`;
    //       // console.log(
    //       //   `Time difference: ${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`
    //       // );

    //       // console.log(time2.toLocaleTimeString(), time1.toLocaleTimeString());
    //       let selectedApp = localStorage.getItem("index");
    //       // console.log(selectedApp);

    //       let app = this.userObject['apps'][selectedApp];

    //       if (app) {
    //         const previousTime = app['usedTime'] || 0;
    //         app['usedTime'] = previousTime + this.usedTime;
    //       }

    //       //  console.log(this.userList);
    //       this.service.saveUpdatedChild(this.userObject).subscribe({
    //         next: (response) => console.log("usetime", response)
    //       })
    //     }
    //   })
    // );
  }


  onTimeSpentOnEachApp(){
    this.router.navigate(['graph']);
  }


  // Method triggered when the user chooses to app
  onPlay(app: any, url: string, index: number): void {

    // Record the current time as the start time for the app (e.g., for usage tracking)
    // app.startTime = new Date().toLocaleTimeString();

    // Optionally store the video URL in a shared service (currently commented out)
    // this.service.videoUrl = url;

    // Navigate to the 'video' route with the app ID as a parameter
    // Also pass additional data via router state
    this.router.navigate(['video', app.id], {
      state: { appData: this.userObject, index: index }
    });
  }

  // Method Triggered when the user clicked on the logout button
  onLogout(): void {
    localStorage.clear(); // it will clear the local storage
    this.router.navigate(['']); // it will navigate to the login page
  }
}
