import { userVerified, getName, getEmail, getUid, getProfilePhoto } from '../auth/authComponents.js';
import { formatDateTweet } from '../general/generalFunc.js';
import { setNewDomComment } from '../general/domComponents.js';

const firestore = firebase.firestore();
let photoTweets = [];
let statusVisibilityTweets = 'everyone';

export const getServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export const addDoc = ({ collectionTarget, docObj }) => firestore.collection(collectionTarget).add(docObj);

export const setDocWithKey = ({ collectionTarget, keyDoc, docContent, configDoc = {} }) => {
  return firestore.collection(collectionTarget).doc(keyDoc).set(
    docContent,
    configDoc
  )
};

export const changeTweetsName = (newName) => {
  firestore
    .collection('tweets')
    .where('uid', '==', getUid())
    .get()
    .then(collTweets => {
      collTweets.forEach(doc => {
        doc.ref.update({
          author: newName
        })
      })
    })
};

export const changeTweetsProfile = (profileUrl) => {
  firestore
    .collection('tweets')
    .where('uid', '==', getUid())
    .get()
    .then(collTweets => {
      collTweets.forEach(doc => {
        doc.ref.update({
          profilePhoto: profileUrl
        })
      })
    })
};

export const getUserData = (uid) => {
  return firestore.collection('userData')
    .doc(uid)
    .get()
};

export const uploadTweet = ({ tweetVal, catchFunc, catchErrElement }) => {
  if(userVerified()) {
    const tweetObj = {
      tweetValue: tweetVal,
      author: getName(),
      email: getEmail(),
      uid: getUid(),
      date: formatDateTweet({
        date: new Date()
      }),
      timestamp: new Date(),
      profilePhoto: getProfilePhoto(),
      photoTweets: photoTweets,
      statusVisibilityTweets
    }
    
    addDoc({
      collectionTarget: 'tweets',
      docObj: tweetObj
    })
    .then(doc => {
      photoTweets = [];
      catchErrElement.innerHTML = '';
      
    })
    .catch(err => {
      catchErrElement.innerHTML = err.message;
      return;
    });
    
    return {
      tweet: tweetObj
    };
  } else {
    catchFunc();
    return;
  }
};

export const setCommentEvent = ({ domElement, arrImg, parentToPrependClass, tweetId }) => {
  const commentInput = domElement.querySelector('.post__postCommentInput');
  const commentSend = domElement.querySelector('.post__commentSendIcon');
  
  commentSend.addEventListener('click', () => {
    const inputValue = commentInput.value;
    
    if(inputValue.trim().length > 0) {
      const objData = {
        commentText: inputValue,
        uid: getUid(),
        date: formatDateTweet({
          date: new Date()
        }),
        author: getName(),
        profilePhoto: getProfilePhoto()
      }
      
      firestore.collection('tweets').doc(tweetId)
               .collection('comments').add(objData)
               .catch(err => {
                 console.log(err.message);
               })
               
      
      setNewDomComment({ parentPost: domElement, comment: objData, method: 'secondChild' });
      
    }
    
  });
  
  return {
    domElement,
    arrImg,
    parentToPrependClass,
    tweetId
  };
};

export const setPhotoTweet = ({ url, fileName, errElement }) => {
  url
    .then(urlTarget => {
      photoTweets.push({
        fileName,
        url: urlTarget
      });
      
      return photoTweets;
    })
    .catch(err => {
      errElement.innerHTML = err.message;
      console.log(err.message);
    })
}

export const getPhotoTweets = () => photoTweets;

export const setNewPhotoTweets = (newPhotoTweets) => {
  photoTweets = newPhotoTweets;
  
  return photoTweets;
};

export const resetPhotoTweet = () => {
  photoTweets = [];
  
  return photoTweets;
}

export const changeStatusVisibility = (change) => {
  statusVisibilityTweets = change;
  
  return statusVisibilityTweets;
}