import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../../infrastructure/services/auth.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  isDarkTheme = false;

  userName = 'Usuario';
  userRole = '';
  userEmail = '';

  ngOnInit() {
    document.body.setAttribute('data-theme', 'light');
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : user.email;
        this.userRole = user.roles?.[0] || '';
        this.userEmail = user.email;
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  logout() {
    this.authService.logout();
  }
}
