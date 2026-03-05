import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../../../application/services/loading.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-web-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class WebLoginPage {
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  showPassword = false;
  rememberMe = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToDashboard() {
    // 1. Mostrar loader
    this.loadingService.show();
    console.log("Esperando 6 segundos...");

    // 2. Usar setTimeout para esperar
    setTimeout(() => {
      // 3. Ocultar loader (aunque al cambiar de página a veces no es necesario, es buena práctica)
      this.loadingService.hide();

      // 4. Navegar SIN recargar la página
      this.router.navigate(['/dashboard']);

      console.log("Yendo al dashboard");
    }, 6000); // 6000 milisegundos = 6 segundos
  }
}
