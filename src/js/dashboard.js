import { createProcess, setLoadingPage, removeLoadingPage, formatName } from './general/generalFunc.js';
import { actualUrl } from './actualUrl.js';
import { uploadTweet } from './firebase/firestoreComponents.js';
import { setOptionsItemColorEvent } from './tweet/tweetStyleComponents.js';
import { createNewTweetElement, prependChild } from './general/domComponents.js';

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

const setCommentOptionEvent = () => {
  optionsItemComment.forEach(element => {
    element.addEventListener('click', () => {
      const commentInputActualPost = element.parentNode.parentNode.querySelector('.post__postCommentInput');
      
      commentInputActualPost.focus();
    });
  });
}


setOptionsItemColorEvent({
  element: optionsItemRetweet,
  newColor: '#55BF82',
  path: './img/retweet-icon-full.svg',
  lastPath: './img/retweet-icon.svg'
});

setOptionsItemColorEvent({
  element: optionsItemLike,
  newColor: '#EC6060',
  path: './img/like-icon-full.svg',
  lastPath: './img/like-icon.svg'
});

setOptionsItemColorEvent({
  element: optionsItemSave,
  newColor: '#5FB4E4',
  path: './img/save-icon-full.svg',
  lastPath: './img/save-icon.svg'
});

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
  const tweetErr = document.querySelector('.tweet__err')
  
  if(tweetTextArea.value.length > 0) {
    tweetErr.innerHTML = '';
    
    const tweetSubmitProcess = createProcess(
      [
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