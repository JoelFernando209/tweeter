import { changeColorWhenClick } from '../general/domComponents.js';

export const setOptionsItemColorEvent = ({ element, newColor, path, lastPath, funcHandler = () => null } = {}) => {
  element.forEach(item => {
    const eventItem = changeColorWhenClick(item, '#7E7E7E', newColor, path, lastPath);
    item.addEventListener('click', () => {
      const eventHandler = eventItem();
      
      const optionsItemText = item.querySelector('.post__optionsItemText');
      
      if(eventHandler) {
        optionsItemText.style.marginTop = '0';
      } else {
        optionsItemText.style.marginTop = '10rem';
      }
    });
    
    funcHandler();
  })
}

export const setOptionEventsTweets = () => {
  const optionsItemComment = document.querySelectorAll('.post__optionsItem--comment');
  const optionsItemRetweet = document.querySelectorAll('.post__optionsItem--retweet');
  const optionsItemLike = document.querySelectorAll('.post__optionsItem--like');
  const optionsItemSave = document.querySelectorAll('.post__optionsItem--save');
  
  optionsItemComment.forEach(element => {
    element.addEventListener('click', () => {
      const commentInputActualPost = element.parentNode.parentNode.querySelector('.post__postCommentInput');
      
      commentInputActualPost.focus();
    });
  });
  
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
}