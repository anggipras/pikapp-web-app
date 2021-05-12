importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js')

firebase.initializeApp({
    messagingSenderId: "601562407388"
})

const initMessaging = firebase.messaging()

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
        .then((registration) => {
            console.log('Registration successful, scope is:', registration.scope);
        }).catch((err) => {
            console.log('Service worker registration failed, error:', err);
        });
}