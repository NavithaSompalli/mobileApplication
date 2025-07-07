import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isToggleActive: boolean = false // enabled toggle button
  @Input() tabType: string = 'app';
  @Output() tabTypeEvent: EventEmitter<string> = new EventEmitter<string>();
  userId: string;

  constructor(private router: Router, private service: ServiceService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.tabType = this.service.addType;
  }

  // Called when tab is switched to update filtered list accordingly
  onSelectedTab(value: string) {
    this.tabType = value;
    this.tabTypeEvent.emit(value);
    this.service.addType = value;
    this.isToggleActive = false;
  }

  // Toggle button state 
  onToggleButton() {
    this.isToggleActive = !this.isToggleActive
  }

  // Clear local storage and log out the user
  onLogout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
