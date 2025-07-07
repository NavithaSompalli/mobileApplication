import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-childgraph',
  templateUrl: './childgraph.component.html',
  styleUrl: './childgraph.component.css',
  standalone: false
})
export class ChildgraphComponent {
  userData: object;

  constructor(public service: ServiceService, private router: Router) { }

  ngOnInit() {
    this.userData = history.state.appData;
  }

 
}
