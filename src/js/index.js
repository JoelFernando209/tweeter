import { createAccount, createAccountGoogle, createAccountFacebook, createAccountGithub } from './auth/signIn.js';
import { validatePw, setLoadingPage } from './general/generalFunc.js';
import { addPwEye } from './components/pwEye.js';
import { actualUrl } from './actualUrl.js';

const formAuth = document.querySelector('.auth__form--index');

const authEmail = document.querySelector('.auth__input--email');
const authPw = document.querySelector('.auth__input--pw');
const authName = document.querySelector('.auth__input--name');
const authError = document.querySelector('.auth__err');

const inputEye = document.querySelector('.input__eye');

const googleAuth = document.querySelector('.auth__social-item--google');
const facebookAuth = document.querySelector('.auth__social-item--fb');
const githubAuth = document.querySelector('.auth__social-item--github');

let eventHandlerEye = false; /* NO USE FOR OTHER EVENTS */

firebase.auth().onAuthStateChanged(user => {
  if(user && user.emailVerified) {
    window.location.replace(`${actualUrl}/dashboard.html`);
  }
})

formAuth.addEventListener('submit', e => {
  e.preventDefault();
  
  const authEmailVal = authEmail.value;
  const authPwVal = authPw.value;
  const authNameVal = authName.value;
  
  if(validatePw(authPwVal) && authNameVal.trim().length > 5) {
    setLoadingPage();
    createAccount(authEmailVal, authPwVal, authNameVal);
  } else {
    putErrorInForm('Something went wrong. Please check your password is secure, your email is correct and your name is valid.');
  }
})

export const putErrorInForm = errorVal => {
  authError.innerHTML = errorVal;
}

const addPwEyeSignIn = addPwEye(authPw, inputEye);
addPwEyeSignIn();

googleAuth.addEventListener('click', () => {
  createAccountGoogle();
})

facebookAuth.addEventListener('click', () => {
  createAccountFacebook();
})

githubAuth.addEventListener('click', () => {
  createAccountGithub();
})