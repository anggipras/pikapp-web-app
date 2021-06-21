import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/analytics'

var firebaseConfig = {
  apiKey: "AIzaSyAhpg4G_EANh5cM9sHUY04XZaTAJVrd0Us",
  authDomain: "pikapp-dev-3789c.firebaseapp.com",
  projectId: "pikapp-dev-3789c",
  storageBucket: "pikapp-dev-3789c.appspot.com",
  messagingSenderId: "865001959940",
  appId: "1:865001959940:web:b3c636fbe71440a015fb51",
  measurementId: "G-7911H17L9R"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const firebaseAnalytics = firebase.analytics();

// export const getToken = (setTokenFound) => {
//     return messaging.getToken({vapidKey: 'BGkBTD4sOCLTqphQtyVB6EKnX1BdMABWbZV_0r2zONYzmV9T67dsP2fbPcCo11gAAOqiYD5WhezFTKDJAAsZL-M'}).then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         setTokenFound(currentToken);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         setTokenFound(currentToken);
//         // shows on the UI that permission is required 
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       console.log("onmessage ::: " + payload);
//       resolve(payload);
//     });
// });

// export default firebase;