// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  test: true,
  domain: 'http://localhost:4200',
  gateway: 'http://192.168.2.100:8020',
  qrCode: 'http://localhost:4200/#/home',
  androidDownloadUrl:
    'https://play.google.com/store/apps/details?id=com.mbamc.buildingcares',
  iosDownloadUrl: 'https://apps.apple.com/us/app/building-cares/id1602344331',
  firebaseConfig: {
    apiKey: 'AIzaSyBbGNe_sYx8N09SWbcOfCmLNVfkWvQ4Jbg',
    authDomain: 'me-chat-a2693.firebaseapp.com',
    databaseURL: 'https://me-chat-a2693-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'me-chat-a2693',
    storageBucket: 'me-chat-a2693.appspot.com',
    messagingSenderId: '352618140115',
    appId: '1:352618140115:web:5dfc0584bc70ff602d1f26',
    measurementId: 'G-GB5E6PTFQN'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
