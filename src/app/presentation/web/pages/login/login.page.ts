import { Component } from '@angular/core';

@Component({
    selector: 'app-web-login',
    standalone: true,
    template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Iniciar Sesión</h2>
        <p>Acceso Administrativo / Web</p>
        <form>
          <div class="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@example.com">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password">
          </div>
          <button type="button">Entrar</button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f0f2f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #3880ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
  `]
})
export class WebLoginPage { }
