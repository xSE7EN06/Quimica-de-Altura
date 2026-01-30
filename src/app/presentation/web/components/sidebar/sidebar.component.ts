import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="logo-area">
        <button class="menu-btn">
            <mat-icon>menu</mat-icon>
        </button>
        <h1>Panel</h1>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/dashboard/plants" routerLinkActive="active" class="nav-item">
          <mat-icon class="icon">local_florist</mat-icon>
          <span>Plantas</span>
        </a>
        <a routerLink="/dashboard/compounds" routerLinkActive="active" class="nav-item">
          <mat-icon class="icon">science</mat-icon>
          <span>Compuestos</span>
        </a>
        <a routerLink="/dashboard/diseases" routerLinkActive="active" class="nav-item">
          <mat-icon class="icon">coronavirus</mat-icon>
          <span>Enfermedades</span>
        </a>
        <a routerLink="/dashboard/symptoms" routerLinkActive="active" class="nav-item">
            <mat-icon class="icon">sick</mat-icon>
            <span>Sintomas</span>
        </a>
        <a routerLink="/dashboard/admin-vias" routerLinkActive="active" class="nav-item">
            <mat-icon class="icon">medication</mat-icon>
            <span>Vias de administración</span>
        </a>
        <a routerLink="/dashboard/medications" routerLinkActive="active" class="nav-item">
            <mat-icon class="icon">medical_services</mat-icon>
            <span>Tratamientos</span>
        </a>
        <a routerLink="/dashboard/users" routerLinkActive="active" class="nav-item">
            <mat-icon class="icon">group</mat-icon>
            <span>Usuarios</span>
        </a>
      </nav>

      <div class="logout-area">
        <button class="nav-item logout">
          <mat-icon class="icon">logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .sidebar {
      width: 260px;
      height: 100%;
      background-color: #f7f9fc;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border-right: 1px solid #eee;
    }
    .logo-area {
      margin-bottom: 2rem;
      padding-left: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-area h1 {
      font-size: 1.25rem;
      font-weight: bold;
      color: #56774f; /* Using the brand green color for the title */
      margin: 0;
    }
    .menu-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        color: #333;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      color: #666;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: 0.9rem;
    }
    .nav-item:hover {
      background-color: rgba(86, 119, 79, 0.1);
      color: #56774f;
    }
    .nav-item.active {
      background-color: #56774f;
      color: white;
      box-shadow: 0 4px 6px rgba(86, 119, 79, 0.2);
    }
    .logout-area {
      margin-top: auto;
      border-top: 1px solid #eee;
      padding-top: 1rem;
    }
    .logout {
      color: #666;
    }
    .logout:hover {
      background-color: #fee;
      color: #d32f2f;
    }
    .icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class SidebarComponent { }
