import { createProcess, setLoadingPage, removeLoadingPage, formatName } from './general/generalFunc.js';
import { actualUrl } from './actualUrl.js';
import { uploadTweet, setPhotoTweet, resetPhotoTweet, getPhotoTweets, changeStatusVisibility, setCommentEvent } from './firebase/firestoreComponents.js';
import { setOptionsItemColorEvent, setOptionEventsTweets } from './tweet/tweetStyleComponents.js';
import { createNewTweetElement, prependChild, profileMenuHandler, createImg, removeAllChildNodes, putGridClass, toggleElementClick, setNewDomComment, setCommentsBlock } from './general/domComponents.js';
import { uploadNormalImg, createRef, deleteAllFilesFromFolder } from './firebase/storageComponents.js';
import { getUid } from './auth/authComponents.js';
import { createGallery, setEventGallery, createNewGalleryElement } from './tweet/galleryTweet.js';
import { bytesToMB } from './general/formatComponents.js';
import { setInputLimit } from './components/setInputLimit.js';
import { divideArrInEqualParts } from './tweet/tweetLogicComponents.js';

const headerParentProfile = document.querySelector('.header__profile');
const headerArrow = document.querySelector('.header__arrow');

const addImgInput = document.querySelector('.tweet__addImgInput');

const signOutMenu = document.querySelector('.menu__item--sign-out');

const profileMenu = document.querySelector('.profile__menu');

const tweetSubmitBtn = document.querySelector('.tweet__submit');

const authPopup = document.querySelector('.auth--popup');

let wasSignedIn = false; // To show other message when signed out and dont to require that needs to be authneticated.
let doTweetWasSubmitted = false;

firebase.auth().onAuthStateChanged(user => {
  if(user && user.emailVerified) {
    const headerName = document.querySelector('.header__name');
    const headerProfile = document.querySelector('.header__img-profile');
    const tweetProfile = document.querySelector('.tweet__profileImg');
    
    headerName.innerHTML = formatName(user.displayName);
    
    if(user.photoURL) {
      headerProfile.setAttribute('src', user.photoURL);
      tweetProfile.setAttribute('src', user.photoURL);
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
  
  firebase.firestore().collection('tweets')
    .where('uid', '!=', user.uid)
    .onSnapshot(tweetsCollection => {
      document.querySelector('.dashboard__tweetPostsLoading').style.display = 'none';
      
      tweetsCollection.forEach((tweet, index) => {
        const newTweetPost = createNewTweetElement({ tweet: tweet.data(), tweetId: tweet.id });
        
        if(tweet.data().photoTweets.length > 0) {
          const galleryTweet = createGallery('.post__tweetImg')(newTweetPost);
          
          setEventGallery(galleryTweet);
        }
        
        prependChild(newTweetPost);
        
        setOptionEventsTweets();
        
        setCommentEvent(newTweetPost);
        
        firebase.firestore().collection('tweets').doc(tweet.id)
          .collection('comments')
          .orderBy('date', 'asc')
          .get()
          .then(commentsCollection => {
            
            if(commentsCollection) {
              if(commentsCollection.size > 10) {
                const dividedArr = divideArrInEqualParts(commentsCollection.docs, 9);
                
                dividedArr[0].forEach(comment => {
                  setNewDomComment({
                    parentPost: newTweetPost.domElement,
                    comment: comment.data(),
                    method: 'secondChild'
                  });
                })
                
                let commentMoreElement = setCommentsBlock(newTweetPost);
                
                const commentMoreElementEvent = () => {
                  let currentIndex = 1;
                  
                  return () => {
                    if(dividedArr[currentIndex]) {
                      dividedArr[currentIndex].forEach(comment => {
                        setNewDomComment({
                          parentPost: newTweetPost.domElement,
                          comment: comment.data(),
                          method: 'append'
                        });
                      })
                      
                      currentIndex++;
                      
                      commentMoreElement.remove();
                      
                      commentMoreElement = setCommentsBlock(newTweetPost);
                      
                      commentMoreElement.addEventListener('click', () => {
                        commentMoreElementEventHandler();
                      });
                    } else {
                      commentMoreElement.remove();
                    }
                  }
                }
                
                const commentMoreElementEventHandler = commentMoreElementEvent();
                
                commentMoreElement.addEventListener('click', () => {
                  commentMoreElementEventHandler();
                });
                
              } else {
                commentsCollection.forEach(comment => {
                  setNewDomComment({
                    parentPost: newTweetPost.domElement,
                    comment: comment.data(),
                    method: 'secondChild'
                  });
                })
              }
              
            }
            
          })
      });
    })
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

const tweetTextArea = document.querySelector('.tweet__textarea');

setInputLimit(tweetTextArea, 400);

tweetSubmitBtn.addEventListener('click', () => {
  doTweetWasSubmitted = true;
  
  const tweetErr = document.querySelector('.tweet__err')
  
  if(tweetTextArea.value.length > 0) {
    tweetErr.innerHTML = '';
    
    const tweetSubmitProcess = createProcess(
      [
        setOptionEventsTweets,
        prependChild,
        setEventGallery,
        createGallery('.post__tweetImg'),
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
    
    document.querySelector('.tweet__images').classList.add('ds-none');
    removeAllChildNodes({ element: document.querySelector('.tweet__images') });
    
    tweetTextArea.value = '';
    
  } else {
    tweetErr.innerHTML = '*Please put a valid description.';
  }
  
})

addImgInput.addEventListener('change', event => {
  const tweetErr = document.querySelector('.tweet__err')
  let arrayFiles = Object.values(event.target.files);
  const tweetImages = document.querySelector('.tweet__images');
  
  if(getPhotoTweets().length > 0) {
    getPhotoTweets().forEach(photo => {
      const photoRef = firebase.storage().ref(`tweets/${getUid()}/${photo.fileName}`);
      
      photoRef.delete();
    })
  }
  
  setTimeout(() => {
    if(doTweetWasSubmitted) {
      return;
    } else {
      getPhotoTweets().forEach(photo => {
        const photoRef = firebase.storage().ref(`tweets/${getUid()}/${photo.fileName}`);
        
        photoRef.delete();
      })
    }
    
    doTweetWasSubmitted = false;
  }, 2 * 60 * 60 * 1000) // 2 horas
  
  resetPhotoTweet();
  tweetImages.className = 'tweet__images ds-none';
  
  if(arrayFiles.length > 0) {
    if(!arrayFiles.every(file => bytesToMB(file.size) < 5)) {
      tweetErr.innerHTML = '*The files cannot be bigger of 5 MB';
      
      return;
    }
  }
  
  if(arrayFiles.length > 3) {
    tweetErr.innerHTML = '*You can only put a maximum of three files';
  } else if(arrayFiles.length >= 1) {
    removeAllChildNodes({ element: document.querySelector('.tweet__images') });
    
    tweetErr.innerHTML = '';
    tweetImages.classList.remove('ds-none');
    
    const gridClass = putGridClass({ arrCompare: arrayFiles });
    
    tweetImages.classList.add(gridClass);
    
    const photoUploadProcess = ({ file }) => createProcess(
      [
        uploadNormalImg({
          endFunc: ({ url, parentClass, errElement, name }) => {
            const domElement = document.querySelector(parentClass);
            
            setPhotoTweet({
              url,
              fileName: name,
              errElement,
            });
            
            const imgItem = createImg({ url, parentClass, errElement, elementClass: 'tweet__imagesItemBox' });
          },
          parentClass: '.tweet__images'
        }),
        createRef
      ],
      {
        pathRef: `tweets/${getUid()}`,
        errElement: tweetErr,
        fileToUpload: file
      }
    );
    
    arrayFiles.forEach((file, index) => {
      const taskPhoto = photoUploadProcess({ file });
      
      taskPhoto();
    });
    
    addImgInput.input = '';
  }
})

const tweetReplyConfig = document.querySelector('.tweet__replyConfig');
const tweetReplyStatus = document.querySelector('.tweet__replyStatus');
const tweetReplyOptions = document.querySelector('.tweet__replyOptions');

const tweetReplyOptionEveryone = document.querySelector('.tweet__replyOptionsItem--everyone');
const tweetReplyOptionFollow = document.querySelector('.tweet__replyOptionsItem--follow');

const tweetReplyEvent = toggleElementClick(tweetReplyConfig, tweetReplyOptions);
tweetReplyEvent();

tweetReplyOptionEveryone.addEventListener('click', () => {
  changeStatusVisibility('everyone');
  
  tweetReplyOptionEveryone.style.fontWeight = '800';
  tweetReplyOptionFollow.style.fontWeight = '';
  
  tweetReplyStatus.innerText = 'Everyone can reply';
});

tweetReplyOptionFollow.addEventListener('click', () => {
  changeStatusVisibility('follow');
  
  tweetReplyOptionFollow.style.fontWeight = '800';
  tweetReplyOptionEveryone.style.fontWeight = '';
  
  tweetReplyStatus.innerText = 'People you follow';
});