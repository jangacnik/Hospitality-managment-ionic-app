import { CapacitorConfig } from '@capacitor/cli';
import {KeyboardResize} from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: 'io.hospify',
  appName: 'Vestlia',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
    },
  },
};

export default config;
