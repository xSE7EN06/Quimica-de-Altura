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
        <header class="top-header">
            <h2 class="page-title">Panel</h2>
            <div class="user-profile">
                <div class="user-info">
                    <span class="user-name">Admin User</span>
                    <span class="user-role">Administrador</span>
                </div>
                <div class="avatar">
                    <img src="assets/avatar-placeholder.png" alt="User" onerror="this.src='https://ui-avatars.com/api/?name=Admin+User&background=random'"/>
                </div>
            </div>
        </header>
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
      background-color: #f5f7fa;
    }
    .sidebar {
      flex: 0 0 260px; /* Fixed width sidebar */
      height: 100%;
      background: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
      z-index: 10;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .top-header {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      background: white;
      border-bottom: 1px solid #eee;
    }
    .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
    .user-profile {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .user-info {
        text-align: right;
        display: flex;
        flex-direction: column;
    }
    .user-name {
        font-weight: 600;
        color: #333;
        font-size: 0.9rem;
    }
    .user-role {
        font-size: 0.75rem;
        color: #888;
    }
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #eee;
    }
    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .content-scroll {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
    }
  `]
})
export class DashboardLayoutComponent { }
