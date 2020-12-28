import { changeColorWhenClick } from '../general/domComponents.js';

export const setOptionsItemColorEvent = (element, newColor, newText, path, lastPath, funcHandler = () => null) => {
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