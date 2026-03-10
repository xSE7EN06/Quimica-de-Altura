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
    }
  },
};

export default config;
