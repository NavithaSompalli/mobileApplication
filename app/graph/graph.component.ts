import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ServiceService } from '../service.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css'], // Corrected 'styleUrl' to 'styleUrls'
    standalone: false
})
export class GraphComponent implements OnInit {
    data: any; // Stores chart data
    options: any; // Stores chart configuration options
    graphUserList: object[] = []; // Stores the full list of users from the service
    platformId = inject(PLATFORM_ID); // Injects the current platform ID (browser/server)
    usersList = []; // Filtered list of users who are of type 'child'

    constructor(private cd: ChangeDetectorRef, private service: ServiceService) { }

    ngOnInit() {
        // Fetch users from the service
        this.service.onGetUsers().subscribe({
            next: (response) => {
                this.graphUserList = response;
                // Filter the list to only include users of type 'child'
                this.usersList = this.graphUserList.filter(item => item['usertype'] === 'child');
                // For each child user, calculate total hours set and total usage time
                this.usersList.forEach(value => {
                    let totalHours = 0;
                    let totalUsedTime = 0;
                    // Loop through the apps used by the child
                    value["apps"].forEach(item => {
                        if (item['hour'] !== undefined) {
                            totalHours = totalHours + Number(item['hour']);
                            // console.log(typeof item['hour'])
                        }

                        if (item['usedTime'] !== undefined) {
                            totalUsedTime = totalUsedTime + item['usedTime']; // Add actual usage time (in minutes)
                            // console.log(totalUsedTime);
                        }
                    });
                    // Store calculated totals back in the user object
                    value["totalHours"] = totalHours;
                    value["totalUsedTime"] = totalUsedTime;
                    // console.log("total", value['totalUsedTime'])
                    // console.log(this.usersList);
                });
                this.initChart(); // Move inside callback to ensure chart initializes after data fetch
            }
        });
    }

    // Method to initialize chart data and styling options
    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.data = {
                labels: this.usersList.map(user => user.name || 'Unnamed'), // Prepare chart data
                datasets: [
                    {
                        label: 'Total Used Time (Minutes)',
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        backgroundColor: documentStyle.getPropertyValue('--p-cyan-300'),
                        yAxisID: 'y',
                        tension: 0.4,
                        data: this.usersList.map(user => user.totalUsedTime || 0)

                        // Decimal hours
                    }
                ]
            };

            // Configure chart appearance and behavior
            this.options = {
                stacked: false,
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };

            // Trigger change detection manually since async code has updated bindings
            this.cd.markForCheck();
        }
    }
}
