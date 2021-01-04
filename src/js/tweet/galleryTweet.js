export const createNewGalleryElement = () => `
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <div class="pswp__bg"></div>

    <div class="pswp__scroll-wrap">
    
      <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
      </div>
  
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <div class="pswp__counter"></div>

            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

            <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut"></div>
                  </div>
                </div>
            </div>
          </div>

          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div class="pswp__share-tooltip"></div>
          </div>

          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </button>

          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </button>

          <div class="pswp__caption">
              <div class="pswp__caption__center"></div>
        </div>

      </div>

    </div>

  </div>
`;

const setItemGallery = ({ arrImg }) => {
  return arrImg.map((imgUrl, index) => {
    return {
      src: imgUrl,
      w: 0,
      h: 0
    }
  })
}

const getImgWidthAndHeight = ({ galleryClass }) => {
  galleryClass.listen('gettingData', (index, item) => {
    if(item.w < 1 || item.h < 1) {
      const img = new Image();
      
      img.onload = function() {
        item.w = this.width;
        item.h = this.height;
        
        galleryClass.invalidateCurrItems();
        galleryClass.updateSize(true);
      };
      
      img.src = item.src;
    }
  })
};

export const createGallery = ({ domElement, arrImg, parentToPrependClass }) => {
  const galleryElement = domElement.querySelector('.pswp');
  const itemsGallery = setItemGallery({ arrImg });
  
  const clickEventHandler = (index) => {
    
    const galleryClass = new PhotoSwipe( galleryElement, PhotoSwipeUI_Default, itemsGallery, {
      showHideOpacity: true,
      bgOpacity: 0.8,
      index
    });
    
    getImgWidthAndHeight({ galleryClass });
    
    galleryClass.init();
  };
  
  return {
    domElement,
    clickEventHandler,
    parentToPrependClass
  };
};

export const setEventGallery = ({ domElement, clickEventHandler, parentToPrependClass }) => {
  const imagesItems = domElement.querySelectorAll('.post__tweetImg');
  
  imagesItems.forEach((img, index) => {
    img.addEventListener('click', () => {
      clickEventHandler(index);
    });
  });
  
  return {
    domElement,
    parentToPrependClass
  }
};