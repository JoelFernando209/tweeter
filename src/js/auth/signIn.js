import { actualUrl } from '../actualUrl.js';
import { removeLoadingPage, putErrorInForm } from '../general/generalFunc.js';

export const createAccount = (email, password, nameUser) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(resUser => {
      resUser.user.updateProfile({
        displayName: nameUser
      }).then(() => {
        const configSendVerificationEmail = {
          url: `${actualUrl}/dashboard.html`
        }
        
        resUser.user.sendEmailVerification(configSendVerificationEmail)
        .then(() => {
          putErrorInForm('.auth__err', '*Last step! We send you an email to verify you. Please check it!');
        })
        .catch(err => {
          putErrorInForm('.auth__err', err.message);
        })
        
        removeLoadingPage();
      })
      .catch(err => {
        putErrorInForm('.auth__err', err.message);
      })
    })
    .catch(err => {
      putErrorInForm('.auth__err', err.message);
      removeLoadingPage();
      return err.message
    });
}
  
export const createAccountGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    window.location.replace(`${actualUrl}/dashboard.html`);
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}

export const createAccountFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    result.user.sendEmailVerification({
      url: `${actualUrl}/dashboard.html`
    })
    .then(() => {
      putErrorInForm('.auth__err', '*Last step! We send you an email to verify you. Please check it!');
    })
    .catch(err => {
      putErrorInForm('.auth__err', err.message);
    })
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}

export const createAccountGithub = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
  .then(result => {
    result.user.sendEmailVerification({
      url: `${actualUrl}/dashboard.html`
    })
    .then(() => {
      putErrorInForm('.auth__err', '*Last step! We send you an email to verify you. Please check it!');
    })
    .catch(err => {
      putErrorInForm('.auth__err', err.message);
    })
  })
  .catch(err => {
    putErrorInForm('.auth__err', err.message);
  })
}