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
export class ChildComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  userList: any;
  apps: any[] = [];
  destroyedTimes: Date[] = [];
  usedTime?: number;

  constructor(public service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    // let userObject = localStorage.getItem("userId")
    // console.log(userObject);

    // this.service.onGetUsers().subscribe({
    //   next: (response) => this.userList = response
    // })
    this.subscription.add(
      this.service.userData$.subscribe(data => {
        this.userList = data;
        this.apps = this.userList?.apps || [];
      })
    );

    this.subscription.add(
      this.service.destroyed$.subscribe(date => {
        this.destroyedTimes.push(date);
        // Only calculate difference if at least two timestamps exist
        if (this.destroyedTimes.length >= 2) {
          const time1 = this.destroyedTimes[this.destroyedTimes.length - 1];
          const time2 = this.destroyedTimes[this.destroyedTimes.length - 2];

          const diffMs = time1.getTime() - time2.getTime();
          const diffSeconds = Math.floor(diffMs / 1000);
          const diffMinutes = Math.floor(diffSeconds / 60);
          const diffHours = Math.floor(diffMinutes / 60);
          this.usedTime = diffHours * 60 + diffMinutes
          console.log('usedTime', this.usedTime);
          // this.usedTime =  `${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`;
          // console.log(
          //   `Time difference: ${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`
          // );

          // console.log(time2.toLocaleTimeString(), time1.toLocaleTimeString());
          let selectedApp = localStorage.getItem("index");
          // console.log(selectedApp);

          let app = this.userList['apps'][selectedApp];

          if (app) {
            const previousTime = app['usedTime'] || 0;
            app['usedTime'] = previousTime + this.usedTime;
          }

          //  console.log(this.userList);
          this.service.saveUpdatedChild(this.userList).subscribe({
            next: (response) => console.log("usetime", response)
          })
        }
      })
    );
  }



  onPlay(app: any, url: any, index: number): void {
    app.startTime = new Date().toLocaleTimeString();
    this.service.notifyDestroyed();
    this.service.videoUrl = url;
    this.router.navigate(['video']);
    localStorage.setItem("index", JSON.stringify(index))
  }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
