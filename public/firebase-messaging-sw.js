importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js')

var firebaseConfig = {
    apiKey: "AIzaSyBbLM1-27VK0e65peGPQgdKH5TGlRnaeio",
    authDomain: "pikapp-web-dev.firebaseapp.com",
    projectId: "pikapp-web-dev",
    storageBucket: "pikapp-web-dev.appspot.com",
    messagingSenderId: "250434670815",
    appId: "1:250434670815:web:5d1043e82d9da3cde9d96a"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
    // console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});