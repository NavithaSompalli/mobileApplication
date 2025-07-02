import { Directive, HostListener, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHoverDelete]',
  standalone:false
})
export class HoverDeleteDirective implements OnDestroy {
  @Input() deleteUrl!: any; // Endpoint for HTTP DELETE

  private deleteButton: HTMLElement | null = null;
  private clickSub: Subscription | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.showDeleteButton();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.removeDeleteButton();   
  }

  private showDeleteButton(): void {
    if (this.deleteButton) return;

    this.deleteButton = this.renderer.createElement('button');
    this.deleteButton.innerText = '❌';

    this.renderer.setStyle(this.deleteButton, 'position', 'absolute');
    this.renderer.setStyle(this.deleteButton, 'top', '5px');
    this.renderer.setStyle(this.deleteButton, 'right', '5px');
    this.renderer.setStyle(this.deleteButton, 'cursor', 'pointer');
    this.renderer.setStyle(this.deleteButton, 'z-index', '10');

    this.renderer.appendChild(this.el.nativeElement, this.deleteButton);

    this.deleteButton.addEventListener('click', this.handleDeleteClick);
  }

  private handleDeleteClick = () => {
    console.log(this.deleteUrl)
    // if (!this.deleteUrl.id) return;

    // this.http.delete(this.deleteUrl).subscribe({
    //   next: () => console.log('✅ Deleted:', this.deleteUrl),
    //   error: (err) => console.error('❌ Delete failed:', err)
    // });

    //  <div [ngStyle]="{'display':'inline'}" appHoverDelete  [deleteUrl]="item"> we want to use this directive we need call in this format
  };

  private removeDeleteButton(): void {
    if (this.deleteButton) {
      this.deleteButton.removeEventListener('click', this.handleDeleteClick);
      this.renderer.removeChild(this.el.nativeElement, this.deleteButton);
      this.deleteButton = null;
    }
  }

  ngOnDestroy(): void {
    this.removeDeleteButton();
    if (this.clickSub) {
      this.clickSub.unsubscribe();
    }
  }
}
