import firebase from 'firebase'

export const firebaseConfig = {
    apiKey: "AIzaSyAhpg4G_EANh5cM9sHUY04XZaTAJVrd0Us",
    authDomain: "pikapp-dev-3789c.firebaseapp.com",
    projectId: "pikapp-dev-3789c",
    storageBucket: "pikapp-dev-3789c.appspot.com",
    messagingSenderId: "865001959940",
    appId: "1:865001959940:web:b3c636fbe71440a015fb51",
    measurementId: "G-7911H17L9R"
  };

firebase.initializeApp(firebaseConfig)
export const firebaseAnalytics = firebase.analytics()