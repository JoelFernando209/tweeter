import { userVerified, getName, getUid, getProfilePhoto } from '../auth/authComponents.js';
import { formatDateTweet } from '../general/generalFunc.js';

const firestore = firebase.firestore();
let photoTweets = [];

export const getServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export const addDoc = ({ collectionTarget, docObj }) => firestore.collection(collectionTarget).add(docObj);

export const setDocWithKey = ({ collectionTarget, keyDoc, docContent, configDoc = {} }) => {
  return firestore.collection(collectionTarget).doc(keyDoc).set(
    docContent,
    configDoc
  )
};

export const uploadTweet = ({ tweetVal, catchFunc, catchErrElement }) => {
  if(userVerified()) {
    const tweetObj = {
      tweetValue: tweetVal,
      author: getName(),
      uid: getUid(),
      date: formatDateTweet({
        date: new Date()
      }),
      profilePhoto: getProfilePhoto(),
      photoTweets: photoTweets
    }
    
    addDoc({
      collectionTarget: 'tweets',
      docObj: tweetObj
    })
    .then(() => {
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

export const setPhotoTweet = ({ url, fileName, errElement }) => {
  url
    .then(urlTarget => {
      photoTweets.push({
        fileName,
        url: urlTarget
      });
      
      console.log(photoTweets);
      
      return photoTweets;
    })
    .catch(err => {
      errElement.innerHTML = err.message;
      console.log(err.message);
    })
}

export const getPhotoTweets = () => photoTweets;

export const resetPhotoTweet = () => {
  photoTweets = [];
  
  return photoTweets;
}