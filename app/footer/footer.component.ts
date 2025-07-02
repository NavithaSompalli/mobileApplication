import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ServiceService } from '../service.service';
import { Subscription } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'], // use 'styleUrls' not 'styleUrl'
  standalone: false
})
export class FooterComponent implements OnDestroy {
  private subscription!: Subscription;
  constructor(private service: ServiceService, private router: Router) { }

  onLogout(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  onGoBack(){
    this.router.navigate(['child']);
  }

  ngOnDestroy(): void {
    this.service.notifyDestroyed();
  }
}
