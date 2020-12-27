import { userVerified, getName, getUid, getProfilePhoto } from '../auth/authComponents.js';

const firestore = firebase.firestore();

export const getServerTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

export const addDoc = ({ collectionTarget, docObj }) => firestore.collection(collectionTarget).add(docObj);

export const uploadTweet = ({ tweetVal, catchFunc }) => {
  if(userVerified()) {
    const tweetObj = {
      tweetValue: tweetVal,
      author: getName(),
      uid: getUid(),
      date: getServerTimestamp(),
      profilePhoto: getProfilePhoto()
    }
    
    addDoc({
      collectionTarget: 'tweets',
      docObj: tweetObj
    })
    
    return tweetObj;
  } else {
    catchFunc();
    return;
  }
};