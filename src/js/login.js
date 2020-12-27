import { loginGoogle, loginFacebook, loginGithub } from './auth/logIn.js';
import { logInWithEmailAndPassword } from './auth/logIn.js';
import { addPwEye } from './components/pwEye.js';

const formAuthLogin = document.querySelector('.auth__form--login');

const authEmail = document.querySelector('.auth__input--email');
const authPw = document.querySelector('.auth__input--pw');
const authErrorLogin = document.querySelector('.auth__err');

const inputEye = document.querySelector('.input__eye');

const googleAuth = document.querySelector('.auth__social-item--google');
const facebookAuth = document.querySelector('.auth__social-item--fb');
const githubAuth = document.querySelector('.auth__social-item--github');

let eventHandlerEye = false; /* NO USE FOR OTHER EVENTS */

export const putErrorInFormLogin = errorVal => {
  authErrorLogin.innerHTML = errorVal;
};

formAuthLogin.addEventListener('submit', e => {
  e.preventDefault();
  
  const authEmailVal = authEmail.value;
  const authPwVal = authPw.value;
  
  logInWithEmailAndPassword(authEmailVal, authPwVal);
});

const addPwEyeLogin = addPwEye(authPw, inputEye);
addPwEyeLogin();

googleAuth.addEventListener('click', () => {
  loginGoogle();
})

facebookAuth.addEventListener('click', () => {
  loginFacebook();
})

githubAuth.addEventListener('click', () => {
  loginGithub();
})