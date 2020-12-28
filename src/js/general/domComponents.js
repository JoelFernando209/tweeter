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

export const prependChild = ({ domElement, parentToAppendClass }) => {
  const parentToAppendElement = document.querySelector(parentToAppendClass);
  
  parentToAppendElement.prepend(domElement);
};

export const createNewTweetElement = ({ tweet }) => {
  
  const newPost = document.createElement('div');
  newPost.className = 'post';
  
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
    
    <div class='post__tweetImg-box'>
      <img src='./img/default-banner.jpg' class='post__tweetImg' />
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
        
        <label class='post__commentInputBox' for='inputComment-1'>
          
          <img src='img/add-image.svg' alt='addImage' class='post__commentInputIcon' title='Add an image to your comment'/>
          
          <input type='text' class='post__postCommentInput' id='inputComment-1' placeholder='Tweet your reply' />
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
    parentToAppendClass: '.dashboard__tweetPosts'
  };
};