importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyAhpg4G_EANh5cM9sHUY04XZaTAJVrd0Us",
  authDomain: "pikapp-dev-3789c.firebaseapp.com",
  projectId: "pikapp-dev-3789c",
  storageBucket: "pikapp-dev-3789c.appspot.com",
  messagingSenderId: "865001959940",
  appId: "1:865001959940:web:b3c636fbe71440a015fb51"
};
  
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  // };

  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});