import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideServiceWorker } from '@angular/service-worker';
import { PlantRepository } from './domain/repositories/plant.repository';
import { MockPlantRepository } from './infrastructure/repositories/mock-plant.repository';
import { UserRepository } from './domain/repositories/user.repository';
import { MockUserRepository } from './infrastructure/repositories/mock-user.repository';
import { CompoundRepository } from './domain/repositories/compound.repository';
import { MockCompoundRepository } from './infrastructure/repositories/mock-compound.repository';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIonicAngular({}),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: PlantRepository, useClass: MockPlantRepository },
    { provide: UserRepository, useClass: MockUserRepository },
    { provide: CompoundRepository, useClass: MockCompoundRepository },
    provideCharts(withDefaultRegisterables())
  ]
};
