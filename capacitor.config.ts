import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.baca.concesionarios',
  appName: 'Concesionarios BaCa',
  webDir: 'www',
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyC8wq96z-YBLYIMmLRioPgW_SDFq8MgBHU' 
    }
  }
};

export default config;
