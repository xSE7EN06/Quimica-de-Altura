import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quimica.altura',
  appName: 'Quimica Altura',
  webDir: 'dist/plant-id-app/browser',
  server: {
    cleartext: true
  },
  plugins: {
    SocialLogin: {
      providers: {
        google: true
      }
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      androidSplashResourceName: "splash",
      androidScaleType: "FIT_CENTER",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#4CAF50",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
