import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mlbbtopup.in',
  appName: 'MLBB Topup',
  webDir: 'out',
  server: {
    url: "https://mlbbtopup.in",
    cleartext: false,
    hostname: "mlbbtopup.in",
    androidScheme: "https",
    allowNavigation: [
      "mlbbtopup.in",
      "*.mlbbtopup.in",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
      "*.gstatic.com",
      "1gamestopup.com",
      "*.1gamestopup.com",
      "xtragateway.site",
      "*.xtragateway.site"
    ]
  },
  android: {
    allowMixedContent: true,
    overrideUserAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
  }
};

export default config;
