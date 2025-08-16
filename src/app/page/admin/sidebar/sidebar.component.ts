import { Component, HostListener, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LoginService } from './../../../services/login.service';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isMobile: boolean = false;
  showSidebar: boolean = true;
  selectedView: string = 'Menú';

  @ViewChildren(MatExpansionPanel) allPanels!: QueryList<MatExpansionPanel>;

  constructor(public login: LoginService) {}

  ngOnInit(): void {
    this.onResize();
  }

  // 📱 Detecta si la pantalla es móvil
  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 768;
    this.showSidebar = !this.isMobile;
  }

  // 🍔 Toggle del menú hamburguesa
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  // 🚪 Cierra el menú al navegar por una opción
  closeSidebarOnNavigate(viewName: string) {
    if (this.isMobile) {
      this.selectedView = viewName;
      this.showSidebar = false;

      setTimeout(() => {
        this.selectedView = 'Panel de administración';
      }, 3000);
    }
  }

  // 🖱️ Detecta clics fuera del menú y lo cierra
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebarElement = document.querySelector('.sidebar-container');
    const hamburgerElement = document.querySelector('.hamburger-header');
    const target = event.target as HTMLElement;

    const clickedInsideSidebar = sidebarElement?.contains(target);
    const clickedHamburger = hamburgerElement?.contains(target);

    if (this.isMobile && this.showSidebar && !clickedInsideSidebar && !clickedHamburger) {
      this.showSidebar = false;
    }
  }

  // 🔐 Cierre de sesión
  public logout() {
    this.login.logout();
    window.location.reload();
  }

  

  // 📁 Cierra los demás paneles cuando uno se abre
  closeOthers(openedPanel: MatExpansionPanel) {
    this.allPanels.forEach(panel => {
      if (panel !== openedPanel) {
        panel.close();
      }
    });
  }
}
