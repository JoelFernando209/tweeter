import { formatName } from './general/generalFunc.js';
import { profileMenuHandler, createNewTweetElement, prependChild } from './general/domComponents.js';
import { createGallery, setEventGallery, createNewGalleryElement } from './tweet/galleryTweet.js';
import { setOptionEventsTweets } from './tweet/tweetStyleComponents.js';
import { setCommentEvent } from './firebase/firestoreComponents.js';

let wasSignedIn = false;

firebase.auth().onAuthStateChanged(user => {
  if(user && user.emailVerified) {
    const headerName = document.querySelector('.header__name');
    const headerProfile = document.querySelector('.header__img-profile');

    headerName.innerHTML = formatName(user.displayName);
    
    if(user.photoURL) {
      headerProfile.setAttribute('src', user.photoURL);
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

const headerParentProfile = document.querySelector('.header__profile');
const profileMenu = document.querySelector('.profile__menu');
const headerArrow = document.querySelector('.header__arrow');

const headerParentProfileEvent = profileMenuHandler({
  profileMenu,
  headerArrow
});

headerParentProfile.addEventListener('click', headerParentProfileEvent);