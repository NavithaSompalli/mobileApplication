import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';


@Component({
  selector: 'app-footer',
  templateUrl: './website.component.html',
  styleUrls: ['./webiste.component.css'],
  standalone: false
})
export class WebsiteComponent implements OnDestroy {
  private monitorInterval: any; // stroing the intervalId
  public app: any; // Object representing the current app being monitored
  public appData: any; // Object representing the current user object
  public elapsed = 0; // Tracks elapsed time (in minutes) in the current session
  private appId: string; // Stores the ID of the current app from the route

  constructor(
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Retrieve state and app ID from route
    this.appData = history.state.appData;
    this.appId = this.route.snapshot.paramMap.get('id') ?? '';
    this.app = this.appData.apps.find((app: any) => app.id === this.appId);

    const initialUsedTime = this.app?.usedTime || 0; // in seconds
    const hourLimit = this.app?.hour; // in hours
    const hasLimit = hourLimit && hourLimit > 0;
    const allowedMinutes = hasLimit ? hourLimit * 60 * 60 : Infinity; // convert hours to minutes

    const start = new Date(); // session start time

    this.monitorInterval = setInterval(() => {
      const now = new Date();
      const sessionElapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000); // in seconds
      console.log(sessionElapsedSeconds);
      this.elapsed = sessionElapsedSeconds;

      const totalUsed = initialUsedTime + sessionElapsedSeconds;
      console.log(totalUsed);

      const index = this.appData.apps.findIndex((obj: any) => obj.id === this.appId);
      this.app['usedTime'] = totalUsed;
      this.appData.apps[index] = this.app;

      // Persist updated usage
      this.service.saveUpdatedChild(this.appData).subscribe({
        next: (response) => console.log('Saved:', response)
      });

      const hours = Math.floor(totalUsed / 3600);
      const remainingSecondsAfterHours = totalUsed % 3600;
      const minutes = Math.floor(remainingSecondsAfterHours / 60)+hours * 60;

      if (hasLimit && minutes >= allowedMinutes) {
        clearInterval(this.monitorInterval);
        this.router.navigate(['/child']);
      }
    }, 1); // every second
  }


  // Clear local storage and redirect to home on logout
  onLogout(): void {
    localStorage.clear();
    clearInterval(this.monitorInterval);
    this.router.navigate(['']);
  }

  // Navigate back to the child dashboard
  onGoBack(): void {
    clearInterval(this.monitorInterval);
    this.router.navigate(['child']);
  }

  // Lifecycle hook triggered when component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.monitorInterval); // Stop the interval if still running
  }
}
