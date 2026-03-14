import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './presentation/web/components/loader/loader.component';
import { BiometricAuthService } from './infrastructure/services/biometric-auth.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('plant-id-app');
  private biometricAuthService = inject(BiometricAuthService);

  async ngOnInit() {
    await this.biometricAuthService.checkBiometricsOnStartup();
    setTimeout(async () => {
      await SplashScreen.hide();
    }, 3000);
  }
}
