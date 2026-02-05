import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="dashboard-container">
      <app-sidebar class="sidebar"></app-sidebar>
      <main class="main-content">
        <div class="content-scroll">
            <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-primary); /* Dark background matching dashboard */
    }
    .sidebar {
      flex: 0 0 250px; /* Fixed width sidebar to match component */
      height: 100%;
      z-index: 10;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .content-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 0; /* Let pages handle their own padding */
    }
  `]
})
export class DashboardLayoutComponent { }
