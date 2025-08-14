import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
  animations: [
    trigger('sidebarAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class UserLayoutComponent implements OnInit {
  sidebarVisible = true;
  mostrarHamburguesa = false;

  @ViewChild('sidebarMenu', { static: false }) sidebarMenu!: ElementRef;

  private startX = 0;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.detectarDispositivo();
  }

  @HostListener('window:resize')
  detectarDispositivo(): void {
    this.mostrarHamburguesa = window.innerWidth < 768;
    this.sidebarVisible = !this.mostrarHamburguesa;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  cerrarSidebarDesdeClick(): void {
    if (this.mostrarHamburguesa) {
      this.sidebarVisible = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.mostrarHamburguesa || !this.sidebarMenu) return;

    const clickedInside = this.sidebarMenu.nativeElement.contains(event.target);
    if (this.sidebarVisible && !clickedInside) {
      this.sidebarVisible = false;
    }
  }

  // 📱 Swipe para cerrar solo en móviles
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.mostrarHamburguesa) return;

    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.mostrarHamburguesa) return;

    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - this.startX;

    if (this.sidebarVisible && deltaX < -50) {
      this.sidebarVisible = false;
    }
  }
}
