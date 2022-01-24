import firebase from 'firebase'

export const firebaseConfig = {
    apiKey: "AIzaSyAxLCQmqtWBOLK2pZmR4RtEYp-jOIb2HIU",
    authDomain: "pikapp-905ea.firebaseapp.com",
    projectId: "pikapp-905ea",
    storageBucket: "pikapp-905ea.appspot.com",
    messagingSenderId: "550552607817",
    appId: "1:550552607817:web:c0b0521233505ab49ff398",
    measurementId: "G-2WEB8SHR5Y"
  };

firebase.initializeApp(firebaseConfig)
export const firebaseAnalytics = firebase.analytics()
