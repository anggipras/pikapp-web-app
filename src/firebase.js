import firebase from 'firebase/app'
import 'firebase/messaging'
// import Swal from 'sweetalert2'

const firebaseConfig = {
    apiKey: "AIzaSyBbLM1-27VK0e65peGPQgdKH5TGlRnaeio",
    authDomain: "pikapp-web-dev.firebaseapp.com",
    projectId: "pikapp-web-dev",
    storageBucket: "pikapp-web-dev.appspot.com",
    messagingSenderId: "250434670815",
    appId: "1:250434670815:web:5d1043e82d9da3cde9d96a"
};

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

export const getToken = (setTokenFound) => {
    return messaging.getToken({ vapidKey: 'BJCOvaBBNyOqX0lyOWEPiIJ9t2UuXQz3bZvsC5BAfogOsf8iRlhrUfCPjhuD0iuLtKV-tU0QmqZ5KMRZgYgek0o' }).then((currentToken) => {
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            // Swal.fire({ text: currentToken })
            setTokenFound(true);
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
        } else {
            console.log('No registration token available. Request permission to generate one.');
            setTokenFound(false);
            // shows on the UI that permission is required 
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
    });
}