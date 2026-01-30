import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
    <div class="dashboard">
      <h2>Bienvenido al Dashboard Web</h2>
      <p>Esta es una vista exclusiva para escritorio.</p>
      
      <div class="stats-grid">
        <div class="card">
          <h3>Usuarios</h3>
          <p class="value">120</p>
        </div>
        <div class="card">
          <h3>Análisis Completados</h3>
          <p class="value">45</p>
        </div>
        <div class="card">
          <h3>Plantas Identificadas</h3>
          <p class="value">12</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard {
      padding: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .value {
      font-size: 2rem;
      font-weight: bold;
      color: #3880ff;
    }
  `]
})
export class DashboardPage { }
