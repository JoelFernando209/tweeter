import { getPhotoTweets, setNewPhotoTweets } from '../firebase/firestoreComponents.js';
import { putGridClass } from '../general/domComponents.js';

export const divideArrInEqualParts = (array, parts) => {
  let result = [];
  
  for(let i = 0; i < array.length; i += parts) {
    result.push(array.slice(i, i + parts));
  }
  
  return result;
}

export const setCancelItemEvent = parentEl => {
  const tweetParent = parentEl.parentElement;
  const parentElCancel = parentEl.querySelector('.tweet__imagesItemCancel');
  const imageItem = parentEl.querySelector('.tweet__imagesItem');
  
  parentElCancel.addEventListener('click', () => {
    const srcImageItem = imageItem.getAttribute('src');
    const photoTweets = getPhotoTweets();
    
    const indexToDelete = photoTweets.findIndex(item => item.url === srcImageItem);
    
    photoTweets.splice(indexToDelete, 1);
    
    setNewPhotoTweets(photoTweets);
    
    const gridClass = putGridClass({ arrCompare: photoTweets });
    tweetParent.className = `tweet__images ${gridClass}`;
    
    parentEl.remove();
    
    if(photoTweets.length <= 0) {
      tweetParent.classList.add('ds-none');
    }
  })
};