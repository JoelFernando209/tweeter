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