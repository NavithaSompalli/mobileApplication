import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../service.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false
})
export class FooterComponent implements OnDestroy {
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
    this.appId = this.route.snapshot.paramMap.get('id') ?? ''; //  Extract the app ID from the current route parameters
    this.app = this.appData.apps.find((app: any) => app.id === this.appId); // Find the matching app by ID
    const initialUsedTime = this.app?.usedTime || 0; // Get previous used time or set to 0 if not available
    const hourLimit = this.app?.hour; // Get the hourly limit set for the app

    const hasLimit = hourLimit && hourLimit > 0; // Check if the app has a valid time limit
    const allowedMinutes = hasLimit ? hourLimit * 60 : Infinity; // Convert hour limit to minutes (or set to Infinity for unlimited)

    const start = new Date(); // Record the session start time

    // Begin monitoring usage
    this.monitorInterval = setInterval(() => {
      const now = new Date(); // Record the current time
      const sessionElapsed = Math.floor((now.getTime() - start.getTime()) / 60000); // Finding the difference between start time and current time (number of minutes). 
      this.elapsed = sessionElapsed; // here updating the minutes
      const totalUsed = initialUsedTime + this.elapsed; // Add session time to previous usage
      console.log(totalUsed);
      // Log for visibility
      // console.log(`App: ${this.app?.name} | Elapsed: ${totalUsed} min`);
      // If limit is exceeded, stop monitoring and redirect
      if (hasLimit && totalUsed >= allowedMinutes) {
        clearInterval(this.monitorInterval); //  Stop monitoring
        this.router.navigate(['/child']); // Navigate to child page
      }
    }, 60000); // Execute the check every 60,000ms (1 minute)
  }

  // Clear local storage and redirect to home on logout
  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  // Navigate back to the child dashboard
  onGoBack(): void {
    this.router.navigate(['child']);
  }

  // Lifecycle hook triggered when component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.monitorInterval); // Stop the interval if still running
    const index = this.appData.apps.findIndex((obj: any) => obj.id === this.appId); // Find the index of the current app in appData

    if (index !== -1) {
      // console.log(this.app['usedTime'], this.elapsed);
      const totalUsed = this.app['usedTime'] + this.elapsed; // Calculate new total used time by adding the session time
      this.app['usedTime'] = totalUsed; // Update the app object with new used time
      this.appData.apps[index] = this.app; // Replace the app data in the array with the updated app based on index
      // Send updated app data back to the service for persistence
      this.service.saveUpdatedChild(this.appData).subscribe({
        next: (response) => console.log('usetime saved:', response)
      });
    }
  }
}
