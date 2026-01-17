import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { appConfig } from './app/app.config';

// Call the element loader before the bootstrap
defineCustomElements(window);

import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
