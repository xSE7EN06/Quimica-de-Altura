import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-web-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="web-container">
      <header class="web-header">
        <h1>Química de Altura - Web Dashboard</h1>
      </header>
      <main class="web-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
    styles: [`
    .web-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .web-header {
      background-color: #fff;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }
    .web-header h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }
    .web-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
  `]
})
export class WebLayoutComponent { }
