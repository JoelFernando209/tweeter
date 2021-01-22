import { formatName } from './general/generalFunc.js';
import { profileMenuHandler, createNewTweetElement, prependChild, setNewDomComment } from './general/domComponents.js';
import { createGallery, setEventGallery, createNewGalleryElement } from './tweet/galleryTweet.js';
import { setOptionEventsTweets } from './tweet/tweetStyleComponents.js';
import { setCommentEvent, getUserData } from './firebase/firestoreComponents.js';

let wasSignedIn = false;

let uidUser;

if(location.search) {
  uidUser = location.search.replace('?uid=', '');
}

firebase.auth().onAuthStateChanged(user => {
  if(!uidUser) {
    uidUser = user.uid;
  }
  
  const headerName = document.querySelector('.header__name');
  const headerProfile = document.querySelector('.header__img-profile');
  const profileHeaderImg = document.querySelector('.profile__headerImg');
  const profileName = document.querySelector('.profile__headerDataName');
  const headerBio = document.querySelector('.profile__headerBio')
  
  if(user) {
    headerName.innerHTML = formatName(user.displayName);
    
    if(user.photoURL) {
      headerProfile.setAttribute('src', user.photoURL);
    } else {
      headerProfile.setAttribute('src', 'img/default-profile.jpg')
    }
  }
  
  
  if(user && user.emailVerified) {
    getUserData(uidUser)
      .then(doc => {
        if(doc.exists) {
          profileName.innerHTML = formatName(doc.data().name);
          
          if(doc.data().bio) {
            headerBio.innerHTML = doc.data().bio;
            
            if(doc.data().bannerUrl) {
              const headerBanner = document.querySelector('.profile__banner');
              
              headerBanner.setAttribute('src', doc.data().bannerUrl);
            }
          } else {
            headerBio.innerHTML = "This user doesn't have a biography :(";
          }
          
          if(doc.data().photoUrl) {
            profileHeaderImg.setAttribute('src', doc.data().photoUrl);
          } else {
            profileHeaderImg.setAttribute('src', 'img/default-profile.jpg');
          }
        }
      })
    
    firebase.firestore().collection('tweets')
    .where('uid', '==', uidUser)
    .orderBy('timestamp', 'asc')
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

const headerParentProfile = document.querySelector('.header__profile');
const profileMenu = document.querySelector('.profile__menu');
const headerArrow = document.querySelector('.header__arrow');
const signOutMenu = document.querySelector('.menu__item--sign-out');

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