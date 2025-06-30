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
    data: any;
    options: any;
    graphUserList: object[] = [];
    platformId = inject(PLATFORM_ID);
    usersList = [];

    constructor(private cd: ChangeDetectorRef, private service: ServiceService) { }

    ngOnInit() {
        this.service.onGetUsers().subscribe({
            next: (response) => {
                this.graphUserList = response;
                this.usersList = this.graphUserList.filter(item => item['usertype'] === 'child')
                this.usersList.forEach(value => {
                    let totalHours = 0;
                    let totalUsedTime = 0;
                    value["apps"].forEach(item => {
                        if (item['hour'] !== undefined) {
                            totalHours = totalHours + item['hour'];
                        }

                        if (item['usedTime'] !== undefined) {
                            totalUsedTime = totalUsedTime + item['usedTime'];
                            console.log(totalUsedTime);
                        }
                    });
                    value["totalHours"] = totalHours;
                    value["totalUsedTime"] = totalUsedTime;
                    console.log("total", value['totalUsedTime'])
                     console.log(this.usersList);
                });
                this.initChart(); // Move inside callback to ensure chart initializes after data fetch
            },
            error: (err) => {
                console.error('Failed to fetch users:', err);
            }
        });

       
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.data = {
                labels: this.usersList.map(user => user.name || 'Unnamed'),
                datasets: [
                    {
                        label: 'Used Time (hrs)',
                        fill: false,
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        backgroundColor: documentStyle.getPropertyValue('--p-cyan-300'),
                        yAxisID: 'y',
                        tension: 0.4,
                        data: this.usersList.map(user => +(user.totalUsedTime / 60).toFixed(2)) // Decimal hours
                    }
                ]
            };

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

            this.cd.markForCheck();
        }
    }
}
