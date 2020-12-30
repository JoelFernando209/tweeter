import { createProcess, setLoadingPage, removeLoadingPage, formatName } from './general/generalFunc.js';
import { actualUrl } from './actualUrl.js';
import { uploadTweet } from './firebase/firestoreComponents.js';
import { setOptionsItemColorEvent, setOptionEventsTweets } from './tweet/tweetStyleComponents.js';
import { createNewTweetElement, prependChild, profileMenuHandler } from './general/domComponents.js';

const headerName = document.querySelector('.header__name');
const headerProfile = document.querySelector('.header__img-profile');
const headerParentProfile = document.querySelector('.header__profile');
const headerArrow = document.querySelector('.header__arrow');

const addImgInput = document.querySelector('.tweet__addImgInput');

const signOutMenu = document.querySelector('.menu__item--sign-out');

const profileMenu = document.querySelector('.profile__menu');

const tweetSubmitBtn = document.querySelector('.tweet__submit');

const authPopup = document.querySelector('.auth--popup');

let wasSignedIn = false; // To show other message when signed out and dont to require that needs to be authneticated.

firebase.auth().onAuthStateChanged(user => {
  if(user && user.emailVerified) {
    headerName.innerHTML = formatName(user.displayName);
    
    if(user.photoURL) {
      headerProfile.setAttribute('src', user.photoURL)
    } else {
      headerProfile.setAttribute('src', 'img/default-profile.jpg')
    }
  } else {
    if(wasSignedIn === true) {
      document.querySelector('.body').innerHTML = `
        <div class='popup'>
          <span class='heading-2'>You have signed out correctly.</span>
          <span class='heading-4'>
            Do you want to <a href='http://localhost:8080'>sign in</a> again?
          </span>
        </div>
      `
    } else {
      document.querySelector('.body').innerHTML = `
        <div class='popup'>
          <span class='heading-2'>You need to be authenticated to perform this action.</span>
          <span class='heading-4'>
            Maybe you can <a href='http://localhost:8080'>sign in</a> or check the verification email to start knowing the news of all the world!
          </span>
        </div>
      `
    }
  }
})

const headerParentProfileEvent = profileMenuHandler({
  profileMenu,
  headerArrow
});

headerParentProfile.addEventListener('click', headerParentProfileEvent);

signOutMenu.addEventListener('click', () => {
  firebase.auth().signOut()
  .then(() => wasSignedIn = true)
  .catch(err => console.log(err.message));
})

tweetSubmitBtn.addEventListener('click', () => {
  const tweetTextArea = document.querySelector('.tweet__textarea');
  const tweetErr = document.querySelector('.tweet__err')
  
  if(tweetTextArea.value.length > 0) {
    tweetErr.innerHTML = '';
    
    const tweetSubmitProcess = createProcess(
      [
        setOptionEventsTweets,
        prependChild,
        createNewTweetElement,
        uploadTweet
      ],
      {
        tweetVal: tweetTextArea.value,
        catchFunc: () => {
          document.querySelector('.body').innerHTML = `
            <div class='popup'>
              <span class='heading-2'>You need to be authenticated to perform this action.</span>
              <span class='heading-4'>
                Maybe you can <a href='http://localhost:8080'>sign in</a> or check the verification email to start knowing the news of all the world!
              </span>
            </div>
          `
        },
        catchErrElement: tweetErr
      }
    );
    
    tweetSubmitProcess();
    
  } else {
    tweetErr.innerHTML = '*Please put a valid description.';
  }
  
})

addImgInput.addEventListener('change', event => {
  const tweetErr = document.querySelector('.tweet__err')
  const arrayFiles = event.target.files;
  
  if(arrayFiles.length > 3) {
    tweetErr.innerHTML = '*You can only put a maximum of three files';
  } else {
    tweetErr.innerHTML = '';
    
    
  }
})