import { createProcess } from './general/generalFunc.js';
import { actualUrl } from './actualUrl.js';
import { setLoadingPage, removeLoadingPage, formatName } from './general/generalFunc.js';
import { uploadTweet } from './firebase/firestoreComponents.js';
import { setOptionsItemColorEvent } from './tweet/tweetStyleComponents.js';

const headerName = document.querySelector('.header__name');
const headerProfile = document.querySelector('.header__img-profile');
const headerParentProfile = document.querySelector('.header__profile');
const headerArrow = document.querySelector('.header__arrow');

const signOutMenu = document.querySelector('.menu__item--sign-out');

const profileMenu = document.querySelector('.profile__menu');

const tweetSubmitBtn = document.querySelector('.tweet__submit');

const authPopup = document.querySelector('.auth--popup');

const optionsItemComment = document.querySelectorAll('.post__optionsItem--comment');
const optionsItemRetweet = document.querySelectorAll('.post__optionsItem--retweet');
const optionsItemLike = document.querySelectorAll('.post__optionsItem--like');
const optionsItemSave = document.querySelectorAll('.post__optionsItem--save');

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

optionsItemComment.forEach(element => {
  element.addEventListener('click', () => {
    const commentInput = document.querySelector('.post__postCommentInput');
    
    commentInput.focus();
  })
})

setOptionsItemColorEvent(optionsItemRetweet, '#55BF82', 'Retweeted', './img/retweet-icon-full.svg', './img/retweet-icon.svg');
setOptionsItemColorEvent(optionsItemLike, '#EC6060', 'Liked', './img/like-icon-full.svg', './img/like-icon.svg');
setOptionsItemColorEvent(optionsItemSave, '#5FB4E4', 'Saved', './img/save-icon-full.svg', './img/save-icon.svg');

const profileMenuHandler = () => {
  let eventHandler = false
  
  return () => {
    if(eventHandler === false) {
      eventHandler = true;
      
      profileMenu.style.display = 'flex';
      headerArrow.style.transform = 'rotate(-90deg) translateY(-.5rem)';
    } else {
      eventHandler = false;
      profileMenu.style.display = 'none';
      headerArrow.style.transform = 'rotate(90deg)';
    }
  }
}

const headerParentProfileEvent = profileMenuHandler();

headerParentProfile.addEventListener('click', headerParentProfileEvent);

signOutMenu.addEventListener('click', () => {
  firebase.auth().signOut()
  .then(() => wasSignedIn = true)
  .catch(err => console.log(err.message));
})

tweetSubmitBtn.addEventListener('click', () => {
  const tweetTextArea = document.querySelector('.tweet__textarea');
  
  const tweetSubmitProcess = createProcess(
    [
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
      }
    }
  );
  
  tweetSubmitProcess();
})