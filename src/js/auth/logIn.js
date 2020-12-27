import { actualUrl } from '../actualUrl.js';
import { putErrorInForm } from '../general/generalFunc.js'
import { sendEmailVerification } from '../components/sendEmailVerification.js';

export const logInWithEmailAndPassword = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(result => {
    if(result.user.emailVerified) {
      window.location.replace(`${actualUrl}/dashboard.html`);
    } else {
      putErrorInForm('.auth__err--login', "You need to be verified to perform this. <a>Click here to get verified</a>");
      
      const errSelect = document.querySelector('.auth__err--login');
      
      errSelect.addEventListener('click', () => {
        sendEmailVerification();
      })
    }
  })
  .catch(err => {
    putErrorInForm('.auth__err--login', err.message);
  })
}

export const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    window.location.replace(`${actualUrl}/dashboard.html`);
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}

export const loginFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    window.location.replace(`${actualUrl}/dashboard.html`)
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}

export const loginGithub = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    window.location.replace(`${actualUrl}/dashboard.html`)
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}