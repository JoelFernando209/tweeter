import { createNewGalleryElement } from '../tweet/galleryTweet.js';
import { generateNewId } from './generalFunc.js';

export const iterateQuerySelectorAll = (query, func, params) => {
  query.forEach(element => {
    func(element, ...params)
  })
}

export const changeColorWhenClick = (element, defaultColor, newColor, path, lastPath) => {
  let eventHandler = false;
  const elementIcon = element.querySelector('.post__optionsIcon');
  
  return () => {
    if(eventHandler) {
      eventHandler = false;
      element.style.color = defaultColor;
      
      elementIcon.setAttribute('src', lastPath);
      
      return true;
    } else {
      eventHandler = true;
      element.style.color = newColor;
      
      elementIcon.setAttribute('src', path);
      
      return false;
    }
  }
}

export const createImg = ({ url, parentClass, errElement, elementClass }) => {
  const parentElement = document.querySelector(parentClass);

  const imgItemBox = document.createElement('div');
  imgItemBox.className = elementClass;
  
  imgItemBox.innerHTML = `
    <div class='tweet__imagesItemLoading'></div>
  `;
  
  parentElement.appendChild(imgItemBox);
  
  url
    .then(urlTarget => {
      imgItemBox.innerHTML = `
        <img class="tweet__imagesItem" src="${urlTarget}">
        
        <div class='tweet__imagesItemLoading ds-none'></div>
      `;
    })
    .catch(err => {
      errElement.innerHTML = err.message;
    })
  
  return {
    imgItemBox
  }
}

export const putGridClass = ({ arrCompare }) => {
  switch (arrCompare.length) {
    case 3:
      return 'grid-3';
    break;
    case 2:
      return 'grid-2';
    default:
      return 'grid-1';
  }
}

export const removeAllChildNodes = ({ element }) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
  
  return {
    element
  }
};

export const profileMenuHandler = ({ profileMenu, headerArrow }) => {
  let eventHandler = false
  
  return () => {
    if(!eventHandler) {
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

export const prependChild = ({ domElement, parentToPrependClass }) => {
  const parentToPrependElement = document.querySelector(parentToPrependClass);
  
  parentToPrependElement.prepend(domElement);
  
  return {
    domElement
  }
};

export const toggleElementClick = (clicker, toggleElement) => {
  let eventHandler = false;
  
  return () => {
    clicker.addEventListener('click', () => {
      if(eventHandler) {
        toggleElement.style.opacity = '1';
        toggleElement.style.visibility = 'visible';
      } else {
        toggleElement.style.opacity = '0';
        toggleElement.style.visibility = 'hidden';
      }
      
      eventHandler = !eventHandler;
    })
  }
}

export const createNewTweetElement = ({ tweet }) => {
  const idTweet = generateNewId();
  
  const newPost = document.createElement('div');
  newPost.className = 'post';
  
  let gridClass = putGridClass({ arrCompare: tweet.photoTweets });
  
  console.log(tweet)
  
  newPost.innerHTML = `
    <div class='post__profile'>
      <img src='${tweet.profilePhoto}' alt='Profile picture' class='post__profileImg' />
      
      <div class='post__profileInfo'>
        <span class='important-text post__name'>${tweet.author}</span>
        <span class='post__date'>${tweet.date}</span>
      </div>
    </div>
    
    <div class='post__tweetText'>
      ${tweet.tweetValue}
    </div>
    
    <div class='${tweet.photoTweets.length > 0 ? `post__tweetImg-box ${gridClass}`: ''}'>
      ${
        tweet.photoTweets.length > 0 ?
          tweet.photoTweets.map(urlTweet => {
            return `<img src='${urlTweet.url}' class='post__tweetImg' />`
          }).join('')
        :
          ''
      }
      
      ${createNewGalleryElement()}
    </div>
    
    <div class='post__data'>
      <span class='post__dataItem post__dataComments'>449 Comments</span>
      <span class='post__dataItem post__dataRetweets'>59k Retweets</span>
      <span class='post__dataItem post__dataSaved'>234 saved</span>
    </div>
    
    <div class='post__options'>
      <div class='post__optionsItem post__optionsItem--comment'>
        <img src="./img/comment-icon.svg" class='post__optionsIcon'>
        Comment
      </div>
      
      <div class='post__optionsItem post__optionsItem--retweet'>
        <img src="./img/retweet-icon.svg" class='post__optionsIcon'>
        <div class='post__optionsItemText'>
          <span class='post__optionsItemTextItem post__optionsItemTextItem--first'>Retweeted</span>
          <span class='post__optionsItemTextItem'>Retweet</span>
        </div>
      </div>
      
      <div class='post__optionsItem post__optionsItem--like'>
        <img src="./img/like-icon.svg" class='post__optionsIcon'>
        <div class='post__optionsItemText'>
          <span class='post__optionsItemTextItem post__optionsItemTextItem--first'>Liked</span>
          <span class='post__optionsItemTextItem'>Like</span>
        </div>
      </div>
      
      <div class='post__optionsItem post__optionsItem--save'>
        <img src="./img/save-icon.svg" class='post__optionsIcon'>
        <div class='post__optionsItemText'>
          <span class='post__optionsItemTextItem post__optionsItemTextItem--first'>Saved</span>
          <span class='post__optionsItemTextItem'>Save</span>
        </div>
      </div>
    </div>
    
    <div class='post__comments'>
      <div class='post__postComment'>
        <img src='./img/default-profile.jpg' class='post__commentPicture' alt='Profile Picture' />
        
        <label class='post__commentInputBox' for='inputComment-${idTweet}'>
          
          <img src='img/add-image.svg' alt='addImage' class='post__commentInputIcon' title='Add an image to your comment'/>
          
          <input type='text' class='post__postCommentInput' id='inputComment-${idTweet}' placeholder='Tweet your reply' />
        </label>
        
        <div class='post__postCommentIcon'></div>
      </div>
      
      <div class='post__postComment'>
        <img src='./img/default-profile.jpg' class='post__commentPicture' alt='Profile picture' />
        
        <div class='post__commentTextBox'>
          <div class='post__commentInfo'>
            <span class='important-text post__commentName'>Waqar Bloom</span>
            <span class='post__commentDate'>24 August at 20:43</span>
          </div>
          
          <div class='post__commentText'>
            Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2
          </div>
        </div>
        
        <div class='post__commentOptions'>
          <span class='post__commentOptionsItem'>
            <object data="./img/like-icon.svg" type="image/svg+xml" class='post__commentOptionsIcon'></object>
            Like
          </span>
          
          <span class='post__commentOptionsItem post__commentOptionsItem--amountLikes'>
            12k Likes
          </span>
        </div>
        
      </div>
    </div>
    
    <div class='post__postComment'>
      <img src='./img/default-profile.jpg' class='post__commentPicture' alt='Profile picture' />
      
      <div class='post__commentTextBox'>
        <div class='post__commentInfo'>
          <span class='important-text post__commentName'>Waqar Bloom</span>
          <span class='post__commentDate'>24 August at 20:43</span>
        </div>
        
        <div class='post__commentText'>
          Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2 Ok this is epic part 2
        </div>
      </div>
      
      <div class='post__commentOptions'>
        <span class='post__commentOptionsItem'>
          <object data="./img/like-icon.svg" type="image/svg+xml" class='post__commentOptionsIcon'></object>
          Like
        </span>
        
        <span class='post__commentOptionsItem post__commentOptionsItem--amountLikes'>
          12k Likes
        </span>
      </div>
    </div>
  `;
  
  return {
    domElement: newPost,
    arrImg: tweet.photoTweets,
    parentToPrependClass: '.dashboard__tweetPosts'
  };
};