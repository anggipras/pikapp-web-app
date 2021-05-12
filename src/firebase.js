import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBbLM1-27VK0e65peGPQgdKH5TGlRnaeio",
    authDomain: "pikapp-web-dev.firebaseapp.com",
    projectId: "pikapp-web-dev",
    storageBucket: "pikapp-web-dev.appspot.com",
    messagingSenderId: "250434670815",
    appId: "1:250434670815:web:5d1043e82d9da3cde9d96a"
}

firebase.initializeApp(config)

export default firebase